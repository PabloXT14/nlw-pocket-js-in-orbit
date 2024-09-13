import { DrizzleGoalsCompletionsRepository } from '@/repositories/drizzle/drizzle-goals-completions-repository'
import { GetWeekSummaryUseCase } from '@/use-cases/get-week-summary'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function getWeekSummary(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const goalsCompletionsRepository = new DrizzleGoalsCompletionsRepository()
  const getWeekSummaryUseCase = new GetWeekSummaryUseCase(
    goalsCompletionsRepository
  )

  const { summary } = await getWeekSummaryUseCase.execute()

  return reply.status(200).send({ summary })
}
