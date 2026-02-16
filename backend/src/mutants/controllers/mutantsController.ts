import { FastifyReply, FastifyRequest } from "fastify";
import { MutantsService } from "../services/mutantsService.interface.js";
import { MutantsController } from "./mutantsController.interface.js";

export class DefaultMutantsController implements MutantsController {
  constructor(private mutantsService: MutantsService) {}

  checkMutant = async (
    request: FastifyRequest<{ Body: { dna: string[] } }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const dna = request.body?.dna;

    if (
      !dna ||
      !Array.isArray(dna) ||
      !dna.every((strand) => /^[ATCG]+$/.test(strand))
    ) {
      reply.status(400).send({ message: "Invalid DNA format" });
      return;
    }

    const result = await this.mutantsService.checkDNA(dna);
    if (result) {
      reply.status(200).send({ message: "Mutant detected" });
    } else {
      reply.status(403).send({ message: "Not a mutant" });
    }
  };
}
