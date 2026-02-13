import { FastifyReply, FastifyRequest } from "fastify";
import MutantsService from "../services/mutantService.interface";
import MutantsController from "./mutantController.interface";

export default class DefaultMutantsController implements MutantsController {
  constructor(private mutantsService: MutantsService) {}

  checkMutant = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const result = await this.mutantsService.checkDNA([]);
    if (result) {
      reply.status(200).send({ message: "Mutant detected" });
    } else {
      reply.status(403).send({ message: "Not a mutant" });
    }
  };
}
