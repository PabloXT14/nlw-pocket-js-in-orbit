import { DrizzleGoalsRepository } from '@/repositories/drizzle/drizzle-goals-repository'
import { GetWeekPendingGoalsUseCase } from '@/use-cases/get-week-pending-goals'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function pendingGoals(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const goalsRepository = new DrizzleGoalsRepository()
  const getWeekPendingGoalsUseCase = new GetWeekPendingGoalsUseCase(
    goalsRepository
  )

  const { pendingGoals } = await getWeekPendingGoalsUseCase.execute()

  return reply.status(200).send({ pendingGoals })
}
