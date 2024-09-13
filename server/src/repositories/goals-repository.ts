export type CreateGoalDTO = {
  title: string
  desiredWeeklyFrequency: number
}

export type GetWeekPendingGoalsDTO = {
  firstDayOfWeek: Date
  lastDayOfWeek: Date
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
  getWeekPendingGoals: (data: GetWeekPendingGoalsDTO) => Promise<PendingGoals[]>
}
