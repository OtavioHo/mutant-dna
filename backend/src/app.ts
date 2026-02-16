import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { mutantRoutes } from "./mutants/routes/index.js";
import { statsRoutes } from "./stats/routes/index.js";
import { RedisCacheProvider } from "./infra/cache/redisProvider.js";
import { PostgresProvider } from "./infra/database/postgresProvider.js";
import dotenv from "dotenv";

export async function buildApp(): Promise<FastifyInstance> {
  dotenv.config();

  const databaseProvider = new PostgresProvider();
  const cacheProvider = new RedisCacheProvider();

  const app = Fastify({ logger: true });

  // Register CORS first, before any routes
  await app.register(cors, {
    origin: true, // Allow all origins
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.register((app) => mutantRoutes(app, databaseProvider, cacheProvider), {
    prefix: "/mutant",
  });
  app.register((app) => statsRoutes(app, databaseProvider, cacheProvider), {
    prefix: "/stats",
  });

  app.get("/", async (request, reply) => ({
    message: "Welcome to the Mutant Detection API",
  }));
  return app;
}
