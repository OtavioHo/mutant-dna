import { FastifyInstance } from "fastify";
import { buildContainer } from "../container";
import { CacheProvider } from "../../infra/cache/cacheProvider.interface";

export function statsRoutes(
  app: FastifyInstance,
  cacheProvider: CacheProvider,
) {
  const container = buildContainer(cacheProvider);
  app.decorate("statsContainer", container);

  app.get("/", container.statsController.getStats);
}
