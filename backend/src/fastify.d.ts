import buildMutantContainer from "./mutants/container/index.js";

declare module "fastify" {
  interface FastifyInstance {
    mutantContainer: ReturnType<typeof buildMutantContainer>;
  }
}
