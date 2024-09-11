import type { Goal, GoalsRepository } from '../repositories/goals-repository'

interface CreateGoalUseCaseRequest {
  title: string
  desiredWeeklyFrequency: number
}

interface CreateGoalUseCaseResponse {
  goal: Goal
}

export class CreateGoalUseCase {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute({
    title,
    desiredWeeklyFrequency,
  }: CreateGoalUseCaseRequest): Promise<CreateGoalUseCaseResponse> {
    const goal = await this.goalsRepository.create({
      title,
      desiredWeeklyFrequency,
    })

    return { goal }
  }
}
