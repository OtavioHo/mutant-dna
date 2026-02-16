import { FastifyInstance } from "fastify";
import { buildContainer } from "../container/index.js";
import { CacheProvider } from "../../infra/cache/cacheProvider.interface.js";
import { DatabaseProvider } from "../../infra/database/databaseProvider.interface.js";

export function statsRoutes(
  app: FastifyInstance,
  databaseProvider: DatabaseProvider,
  cacheProvider: CacheProvider,
) {
  const container = buildContainer(databaseProvider, cacheProvider);
  app.decorate("statsContainer", container);

  app.get("/", container.statsController.getStats);
}
