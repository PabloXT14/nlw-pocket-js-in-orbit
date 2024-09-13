import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../../db'
import { goals, goalsCompletions } from '../../db/schema'
import type {
  CreateGoalDTO,
  GetWeekPendingGoalsDTO,
  GoalsRepository,
} from '../goals-repository'

export class DrizzleGoalsRepository implements GoalsRepository {
  async create(data: CreateGoalDTO) {
    const result = await db
      .insert(goals)
      .values({
        title: data.title,
        desiredWeeklyFrequency: data.desiredWeeklyFrequency,
      })
      .returning()

    const goal = result[0]

    return goal
  }

  async getWeekPendingGoals({
    firstDayOfWeek,
    lastDayOfWeek,
  }: GetWeekPendingGoalsDTO) {
    // $with => para criar uma "Comumon Table Expression" (CTE), que é uma expressão/sub-consulta que pode ser reutilizada em outras consultas SQL.

    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
      db
        .select({
          id: goals.id,
          title: goals.title,
          desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
          createdAt: goals.createdAt,
        })
        .from(goals)
        .where(lte(goals.createdAt, lastDayOfWeek))
    )

    const goalsCompletionCount = db.$with('goals_completion_count').as(
      db
        .select({
          goalId: goalsCompletions.goalId,
          completionCount: count(goalsCompletions.id).as('completion_count'),
        })
        .from(goalsCompletions)
        .where(
          and(
            gte(goalsCompletions.createdAt, firstDayOfWeek),
            lte(goalsCompletions.createdAt, lastDayOfWeek)
          )
        )
        .groupBy(goalsCompletions.goalId)
    )

    const pendingGoals = await db
      .with(goalsCreatedUpToWeek, goalsCompletionCount)
      .select({
        id: goalsCreatedUpToWeek.id,
        title: goalsCreatedUpToWeek.title,
        desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
        completionCount: sql /*sql*/`
          COALESCE(${goalsCompletionCount.completionCount}, 0)
        `.mapWith(Number),
      })
      .from(goalsCreatedUpToWeek)
      .leftJoin(
        goalsCompletionCount,
        eq(goalsCompletionCount.goalId, goalsCreatedUpToWeek.id)
      )

    return pendingGoals
  }
}
