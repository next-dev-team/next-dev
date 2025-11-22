import Fastify, { type FastifyError } from "fastify"
import cors from "@fastify/cors"
import { usersRoutes } from "./users"
import { postsRoutes } from "./posts"

export function createServer() {
  const app = Fastify({ logger: true })

  app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "*"
  })

  app.setErrorHandler((error: FastifyError, request, reply) => {
    const statusCode = error.statusCode ?? 500
    const message = error.message ?? "Internal Server Error"
    reply.status(statusCode).send({ success: false, error: message })
  })

  app.register(usersRoutes, { prefix: "/api/users" })
  app.register(postsRoutes, { prefix: "/api/posts" })

  return app
}
