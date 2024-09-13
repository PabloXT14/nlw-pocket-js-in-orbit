import type {
  GoalsCompletionsRepository,
  Summary,
} from '@/repositories/goals-completions-repository'
import dayjs from 'dayjs'

interface GetWeekSummaryUseCaseResponse {
  summary: Summary
}

export class GetWeekSummaryUseCase {
  constructor(private goalsCompletionsRepository: GoalsCompletionsRepository) {}

  async execute(): Promise<GetWeekSummaryUseCaseResponse> {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const summary = await this.goalsCompletionsRepository.getWeekSummary({
      firstDayOfWeek,
      lastDayOfWeek,
    })

    return { summary }
  }
}
