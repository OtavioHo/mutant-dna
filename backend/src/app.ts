import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { mutantRoutes } from "./mutants/routes/index.js";
import { statsRoutes } from "./stats/routes/index.js";
import { RedisCacheProvider } from "./infra/cache/redisProvider.js";
import { PostgresProvider } from "./infra/database/postgresProvider.js";
import dotenv from "dotenv";

export function buildApp(): FastifyInstance {
  dotenv.config();

  const databaseProvider = new PostgresProvider();
  const cacheProvider = new RedisCacheProvider();

  const app = Fastify({ logger: true });
  app.register(cors, {
    origin: "*",
  });
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
