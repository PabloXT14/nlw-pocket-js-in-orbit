import type { FastifyInstance } from 'fastify'
import { create } from './create'
import { pendingGoals } from './pending-goals'

export async function goalsRoutes(app: FastifyInstance) {
  app.post('/goals', create)
  app.get('/goals/pending', pendingGoals)
}
