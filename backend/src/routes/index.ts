import { FastifyInstance } from "fastify";
import helloController from "../controllers/helloController";

export default function routes(app: FastifyInstance) {
  app.get("/", async (request, reply) => ({ message: "OK" }));

  app.get("/hello", helloController.getHello);
}
