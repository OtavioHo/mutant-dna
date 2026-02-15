import { FastifyInstance } from "fastify";
import { buildContainer } from "../container";
import { CacheProvider } from "../../infra/cache/cacheProvider.interface";
import { DatabaseProvider } from "../../infra/database/databaseProvider.interface";

export function statsRoutes(
  app: FastifyInstance,
  databaseProvider: DatabaseProvider,
  cacheProvider: CacheProvider,
) {
  const container = buildContainer(databaseProvider, cacheProvider);
  app.decorate("statsContainer", container);

  app.get("/", container.statsController.getStats);
}
