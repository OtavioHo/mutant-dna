import Fastify, { FastifyInstance } from "fastify";
import mutantRoutes from "./mutants/routes/index";
import { statsRoutes } from "./stats/routes/index";
import { RedisCacheProvider } from "./infra/cache/redisProvider";
import { PostgresProvider } from "./infra/database/postgresProvider";
import dotenv from "dotenv";

export function buildApp(): FastifyInstance {
  dotenv.config();

  const databaseProvider = new PostgresProvider();
  const cacheProvider = new RedisCacheProvider();

  const app = Fastify({ logger: true });
  app.register((app) => mutantRoutes(app, databaseProvider, cacheProvider), {
    prefix: "/mutants",
  });
  app.register((app) => statsRoutes(app, databaseProvider, cacheProvider), {
    prefix: "/stats",
  });

  app.get("/", async (request, reply) => ({
    message: "Welcome to the Mutant Detection API",
  }));
  return app;
}
