import Fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import rateLimit from "@fastify/rate-limit"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"

import { env } from "./config/env"
import { setupRoutes } from "./routes"

const server = Fastify({
  logger: true,
})

// Register plugins
await server.register(cors, {
  origin: env.CORS_ORIGIN,
  credentials: true,
})

await server.register(jwt, {
  secret: env.JWT_SECRET,
})

await server.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
})

// Swagger documentation
await server.register(swagger, {
  openapi: {
    info: {
      title: "ToolScape API",
      description: "API documentation for ToolScape",
      version: "1.0.0",
    },
  },
})

await server.register(swaggerUi, {
  routePrefix: "/docs",
})

// Register routes
await setupRoutes(server)

// Start server
try {
  await server.listen({ port: env.PORT, host: "0.0.0.0" })
  console.log(`Server listening on port ${env.PORT}`)
} catch (err) {
  server.log.error(err)
  process.exit(1)
} 