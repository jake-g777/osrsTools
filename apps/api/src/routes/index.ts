import { FastifyInstance } from "fastify"
import { itemsRoutes } from "./items"
import { monstersRoutes } from "./monsters"
import { gePricesRoutes } from "./ge-prices"
import { worldEventsRoutes } from "./world-events"

export async function setupRoutes(app: FastifyInstance) {
  // API v1 routes
  app.register(itemsRoutes, { prefix: "/api/v1/items" })
  app.register(monstersRoutes, { prefix: "/api/v1/monsters" })
  app.register(gePricesRoutes, { prefix: "/api/v1/ge-prices" })
  app.register(worldEventsRoutes, { prefix: "/api/v1/world-events" })

  // Health check
  app.get("/health", async () => {
    return { status: "ok" }
  })
} 