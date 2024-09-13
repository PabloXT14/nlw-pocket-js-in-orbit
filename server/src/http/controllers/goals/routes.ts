import type { FastifyInstance } from 'fastify'
import { createGoal } from './create-goal'
import { pendingGoals } from './pending-goals'
import { createGoalCompletion } from './create-goal-completion'

export async function goalsRoutes(app: FastifyInstance) {
  app.post('/goals', createGoal)
  app.get('/goals/pending', pendingGoals)
  app.post('/goals/:goalId/completions', createGoalCompletion)
}
