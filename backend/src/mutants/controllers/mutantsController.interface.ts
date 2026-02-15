import { FastifyReply, FastifyRequest } from "fastify";

export interface MutantsController {
  checkMutant(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
