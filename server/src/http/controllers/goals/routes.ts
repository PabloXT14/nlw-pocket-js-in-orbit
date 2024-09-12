import type { FastifyInstance } from 'fastify'
import { create } from './create'
import { pendingGoals } from './pending-goals'
import { createGoalCompletion } from './create-goal-completion'

export async function goalsRoutes(app: FastifyInstance) {
  app.post('/goals', create)
  app.get('/goals/pending', pendingGoals)
  app.post('/goals/:goalId/completions', createGoalCompletion)
}
