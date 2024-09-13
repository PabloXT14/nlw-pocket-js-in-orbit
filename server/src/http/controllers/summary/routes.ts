import type { FastifyInstance } from 'fastify'
import { getWeekSummary } from './get-week-summary'

export async function summaryRoutes(app: FastifyInstance) {
  app.get('/summary', getWeekSummary)
}
