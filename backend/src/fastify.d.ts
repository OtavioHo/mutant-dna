import buildMutantContainer from "./mutants/container";

declare module "fastify" {
  interface FastifyInstance {
    mutantContainer: ReturnType<typeof buildMutantContainer>;
  }
}
