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

export type PendingGoals = {
  id: string
  title: string
  desiredWeeklyFrequency: number
  completionCount: number
}

export interface GoalsRepository {
  create: (data: CreateGoalDTO) => Promise<Goal>
  getWeekPendingGoals: (
    firstDayOfWeek: Date,
    lastDayOfWeek: Date
  ) => Promise<PendingGoals[]>
}
