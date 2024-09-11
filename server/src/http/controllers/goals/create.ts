import { DrizzleGoalsRepository } from '@/repositories/drizzle/drizzle-goals-repository'
import { CreateGoalUseCase } from '@/use-cases/create-goal'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    title: z.string(),
    desiredWeeklyFrequency: z.number().int().min(1).max(7),
  })

  const { title, desiredWeeklyFrequency } = createBodySchema.parse(request.body)

  try {
    const goalsRepository = new DrizzleGoalsRepository()
    const createGoalUseCase = new CreateGoalUseCase(goalsRepository)
    await createGoalUseCase.execute({
      title,
      desiredWeeklyFrequency,
    })

    return reply.status(201).send()
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(500).send({ message: err.message })
    }

    throw err
  }
}
