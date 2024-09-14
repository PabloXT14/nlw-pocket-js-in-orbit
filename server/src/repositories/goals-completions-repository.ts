export interface GoalCompletionsRepositoryDTO {
  goalId: string
  firstDayOfWeek: Date
  lastDayOfWeek: Date
}

export interface GetWeekSummaryDTO {
  firstDayOfWeek: Date
  lastDayOfWeek: Date
}

export interface GoalCompletion {
  id: string
  goalId: string
  createdAt: Date
}

export interface GoalToBeCompleted {
  desiredWeeklyFrequency: number
  completionCount: number
}

export type CompletedGoalPerDay = Record<
  string,
  {
    id: string
    title: string
    completedAt: Date
  }[]
>

export interface Summary {
  completed: number
  total: number
  goalsPerDay: CompletedGoalPerDay
}

export interface GoalsCompletionsRepository {
  create: (goalId: string) => Promise<GoalCompletion>
  getGoalCompletionsByGoalId: (
    data: GoalCompletionsRepositoryDTO
  ) => Promise<GoalToBeCompleted>
  getWeekSummary: (data: GetWeekSummaryDTO) => Promise<Summary>
}
