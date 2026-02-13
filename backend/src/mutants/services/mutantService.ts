import MutantsRepository from "../repositories/mutantsRepository.interface";
import MutantDetector from "./mutantDetector.interface";
import MutantsService from "./mutantService.interface";

export default class DefaultMutantsService implements MutantsService {
  constructor(
    private mutantDetector: MutantDetector,
    private mutantsRepository: MutantsRepository,
  ) {}

  async checkDNA(dna: string[]) {
    const result = await this.mutantDetector.isMutant(dna);

    this.mutantsRepository.saveMutant(["test1"], "test", result);

    return result;
  }
}
