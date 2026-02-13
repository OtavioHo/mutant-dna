import Fastify, { FastifyInstance } from "fastify";
import mutantRoutes from "./mutants/routes/index";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });
  app.register(mutantRoutes, { prefix: "/mutants" });

  app.get("/", async (request, reply) => ({
    message: "Welcome to the Mutant Detection API",
  }));
  return app;
}
