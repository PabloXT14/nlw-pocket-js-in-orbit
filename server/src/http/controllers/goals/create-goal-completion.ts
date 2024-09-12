import { DrizzleGoalsCompletionsRepository } from '@/repositories/drizzle/drizzle-goals-completions-repository'
import { CreateGoalCompletionUseCase } from '@/use-cases/create-goal-completion'
import { GoalAlreadyCompletedError } from '@/use-cases/errors/goal-already-completed-error'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function createGoalCompletion(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createGoalCompletionParamsSchema = z.object({
    goalId: z.string(),
  })

  try {
    const { goalId } = createGoalCompletionParamsSchema.parse(request.params)

    const goalsCompletionsRepository = new DrizzleGoalsCompletionsRepository()
    const createGoalCompletionUseCase = new CreateGoalCompletionUseCase(
      goalsCompletionsRepository
    )

    await createGoalCompletionUseCase.execute({
      goalId,
    })

    return reply.status(201).send()
  } catch (err) {
    if (err instanceof GoalAlreadyCompletedError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
