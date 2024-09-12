export interface GoalCompletionsRepositoryDTO {
  goalId: string
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

export interface GoalsCompletionsRepository {
  create: (goalId: string) => Promise<GoalCompletion>
  getGoalCompletionsByGoalId: (
    data: GoalCompletionsRepositoryDTO
  ) => Promise<GoalToBeCompleted>
}
