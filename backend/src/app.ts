import Fastify, { FastifyInstance } from "fastify";
import routes from "./routes/index.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });
  routes(app);
  return app;
}
