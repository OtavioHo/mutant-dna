import { FastifyInstance } from "fastify";
import buildContainer from "../container";
import { CacheProvider } from "../../infra/cache/cacheProvider.interface";

/**
 * Register mutant-related routes on a Fastify instance.
 *
 * @param app - The Fastify application instance to extend and register routes on.
 *
 * @remarks
 * Builds the dependency injection container, decorates the Fastify instance with
 * "mutantContainer", and registers the GET "/" route handled by the container's
 * mutantController.checkMutant handler.
 *
 * @note
 * If `checkMutant` is an instance method that uses `this`, it must be bound to
 * its controller (for example via `container.mutantController.checkMutant.bind(container.mutantController)`
 * or by exposing it as an already-bound/arrow function) before being passed to
 * `app.get`. If `checkMutant` does not rely on `this` or is already bound, no
 * explicit `.bind` is necessary.
 */
export default function routes(
  app: FastifyInstance,
  cacheProvider: CacheProvider,
) {
  const container = buildContainer(cacheProvider);
  app.decorate("mutantContainer", container);

  app.post("/", {
    handler: container.mutantsController.checkMutant,
    schema: {
      body: {
        type: "object",
        properties: {
          dna: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["dna"],
      },
    },
  });
}
