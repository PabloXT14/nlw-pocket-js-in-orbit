import { db } from '@/db'
import { goals, goalsCompletions } from '@/db/schema'
import type { GoalsCompletionsRepository } from '@/repositories/goals-completions-repository'
import dayjs from 'dayjs'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { GoalAlreadyCompletedError } from './errors/goal-already-completed-error'

interface GoalsCompletionsUseCaseRequest {
  goalId: string
}

export class CreateGoalCompletionUseCase {
  constructor(private goalsCompletionsRepository: GoalsCompletionsRepository) {}

  async execute({ goalId }: GoalsCompletionsUseCaseRequest) {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const { completionCount, desiredWeeklyFrequency } =
      await this.goalsCompletionsRepository.getGoalCompletionsByGoalId({
        goalId,
        firstDayOfWeek,
        lastDayOfWeek,
      })

    if (completionCount >= desiredWeeklyFrequency) {
      throw new GoalAlreadyCompletedError()
    }

    const insertResult = await db
      .insert(goalsCompletions)
      .values({ goalId })
      .returning()
    const goalCompletion = insertResult[0]

    return { goalCompletion }
  }
}
