import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { goalsRoutes } from './http/controllers/goals/routes'
import { summaryRoutes } from './http/controllers/summary/routes'
import fastifyCors from '@fastify/cors'

export const app = fastify()

app.register(fastifyCors, {
  origin: env.NODE_ENV === 'production' ? env.FRONTEND_URL : '*',
})

app.register(goalsRoutes)
app.register(summaryRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({
    message: 'Internal server error.',
  })
})
