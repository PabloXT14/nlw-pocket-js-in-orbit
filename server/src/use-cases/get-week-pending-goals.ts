import { db } from '@/db'
import { goals, goalsCompletions } from '@/db/schema'
import type {
  GoalsRepository,
  Goal,
  PendingGoals,
} from '@/repositories/goals-repository'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { lte, count, and, gte, eq, sql } from 'drizzle-orm'

dayjs.extend(weekOfYear)

interface GetWeekPadingGoalsUseCaseResponse {
  pendingGoals: PendingGoals[]
}

export class GetWeekPendingGoalsUseCase {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute(): Promise<GetWeekPadingGoalsUseCaseResponse> {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const pendingGoals = await this.goalsRepository.getWeekPendingGoals(
      firstDayOfWeek,
      lastDayOfWeek
    )

    return { pendingGoals }
  }
}
