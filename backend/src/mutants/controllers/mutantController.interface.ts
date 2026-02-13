import { FastifyReply, FastifyRequest } from "fastify";

export default interface MutantsController {
  checkMutant(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
