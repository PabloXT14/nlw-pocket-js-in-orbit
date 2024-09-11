export type CreateGoalDTO = {
  title: string
  desiredWeeklyFrequency: number
}

export type Goal = {
  id: string
  title: string
  desiredWeeklyFrequency: number
  createdAt: Date
}

export interface GoalsRepository {
  create: (data: CreateGoalDTO) => Promise<Goal>
}
