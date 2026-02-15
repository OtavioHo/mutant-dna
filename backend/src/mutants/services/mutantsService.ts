import { MutantsRepository } from "../repositories/mutantsRepository.interface";
import { MutantsDetector } from "./mutantsDetector.interface";
import { MutantsService } from "./mutantsService.interface";
import { MutantsHashService } from "./mutantsHashService.interface";

export class DefaultMutantsService implements MutantsService {
  constructor(
    private mutantsDetector: MutantsDetector,
    private mutantsRepository: MutantsRepository,
    private mutantsHashService: MutantsHashService,
  ) {}

  async checkDNA(dna: string[]) {
    const hash = this.mutantsHashService.hashDNA(dna);
    let cachedResult = await this.mutantsRepository.getMutantByHash(hash);
    if (cachedResult) {
      console.log("Cache hit for DNA hash:", hash);
      return cachedResult.is_mutant;
    }

    const result = await this.mutantsDetector.isMutant(dna);

    this.mutantsRepository.saveMutant(dna, hash, result);

    return result;
  }
}
