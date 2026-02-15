import { FastifyInstance } from "fastify";
import { buildContainer } from "../container";

export function statsRoutes(app: FastifyInstance) {
  const container = buildContainer();
  app.decorate("statsContainer", container);

  app.get("/", container.statsController.getStats);
}
