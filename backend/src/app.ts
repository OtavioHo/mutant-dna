import Fastify, { FastifyInstance } from "fastify";
import mutantRoutes from "./mutants/routes/index";
import { statsRoutes } from "./stats/routes/index";
import { RedisCacheProvider } from "./infra/cache/redisProvider";

export function buildApp(): FastifyInstance {
  const cacheProvider = new RedisCacheProvider();

  const app = Fastify({ logger: true });
  app.register((app) => mutantRoutes(app, cacheProvider), {
    prefix: "/mutants",
  });
  app.register((app) => statsRoutes(app, cacheProvider), { prefix: "/stats" });

  app.get("/", async (request, reply) => ({
    message: "Welcome to the Mutant Detection API",
  }));
  return app;
}
