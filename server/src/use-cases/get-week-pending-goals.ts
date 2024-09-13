import type {
  GoalsRepository,
  PendingGoals,
} from '@/repositories/goals-repository'
import dayjs from 'dayjs'

interface GetWeekPadingGoalsUseCaseResponse {
  pendingGoals: PendingGoals[]
}

export class GetWeekPendingGoalsUseCase {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute(): Promise<GetWeekPadingGoalsUseCaseResponse> {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const pendingGoals = await this.goalsRepository.getWeekPendingGoals({
      firstDayOfWeek,
      lastDayOfWeek,
    })

    return { pendingGoals }
  }
}
