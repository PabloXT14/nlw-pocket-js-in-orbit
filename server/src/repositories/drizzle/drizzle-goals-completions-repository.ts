import { db } from '@/db'
import type {
  CompletedGoalPerDay,
  GetWeekSummaryDTO,
  GoalCompletionsRepositoryDTO,
  GoalsCompletionsRepository,
} from '../goals-completions-repository'
import { goals, goalsCompletions } from '@/db/schema'
import { and, count, desc, eq, gte, lte, sql } from 'drizzle-orm'

export class DrizzleGoalsCompletionsRepository
  implements GoalsCompletionsRepository
{
  async create(goalId: string) {
    const result = await db
      .insert(goalsCompletions)
      .values({ goalId })
      .returning()
    const goalCompletion = result[0]

    return goalCompletion
  }

  async getGoalCompletionsByGoalId({
    goalId,
    firstDayOfWeek,
    lastDayOfWeek,
  }: GoalCompletionsRepositoryDTO) {
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
            lte(goalsCompletions.createdAt, lastDayOfWeek),
            eq(goalsCompletions.goalId, goalId)
          )
        )
        .groupBy(goalsCompletions.goalId)
    )

    const goalToBeCompleted = await db
      .with(goalsCompletionCount)
      .select({
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        completionCount: sql /*sql*/`
          COALESCE(${goalsCompletionCount.completionCount}, 0)
        `.mapWith(Number),
      })
      .from(goals)
      .leftJoin(goalsCompletionCount, eq(goalsCompletionCount.goalId, goals.id))
      .where(eq(goals.id, goalId))
      .limit(1)

    return goalToBeCompleted[0]
  }

  async getWeekSummary({ firstDayOfWeek, lastDayOfWeek }: GetWeekSummaryDTO) {
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

    const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
      db
        .select({
          id: goalsCompletions.id,
          title: goals.title,
          completedAt: goalsCompletions.createdAt,
          completedAtDate: sql /*sql*/`
            DATE(${goalsCompletions.createdAt})
          `.as('completed_at_date'),
        })
        .from(goalsCompletions)
        .innerJoin(goals, eq(goals.id, goalsCompletions.goalId))
        .where(
          and(
            gte(goalsCompletions.createdAt, firstDayOfWeek),
            lte(goalsCompletions.createdAt, lastDayOfWeek)
          )
        )
        .orderBy(desc(goalsCompletions.createdAt))
    )

    const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
      db
        .select({
          completedAtDate: goalsCompletedInWeek.completedAtDate,
          completions: sql /*sql*/`
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', ${goalsCompletedInWeek.id},
                'title', ${goalsCompletedInWeek.title},
                'completedAt', ${goalsCompletedInWeek.completedAt}
              )
            )
          `.as('completions'),
        })
        .from(goalsCompletedInWeek)
        .groupBy(goalsCompletedInWeek.completedAtDate)
        .orderBy(desc(goalsCompletedInWeek.completedAtDate))
    )

    const result = await db
      .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
      .select({
        completed: sql /*sql*/`
          (SELECT COUNT(*) FROM ${goalsCompletedInWeek})
        `.mapWith(Number),
        total: sql /*sql*/`
          (SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})
        `.mapWith(Number),
        goalsPerDay: sql /*sql*/<CompletedGoalPerDay>`
          JSON_OBJECT_AGG(
            ${goalsCompletedByWeekDay.completedAtDate},
            ${goalsCompletedByWeekDay.completions}
          )
        `,
      })
      .from(goalsCompletedByWeekDay)

    return result[0]
  }
}
