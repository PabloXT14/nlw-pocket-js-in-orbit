import type { FastifyInstance } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
  app.get('/user', (_, reply) => {
    return reply.status(200).send({
      message: 'Hello World',
    })
  })
}
