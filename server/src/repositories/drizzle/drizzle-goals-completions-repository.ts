import { db } from '@/db'
import type {
  GoalCompletionsRepositoryDTO,
  GoalsCompletionsRepository,
  GoalToBeCompleted,
} from '../goals-completions-repository'
import { goals, goalsCompletions } from '@/db/schema'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'

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
}
