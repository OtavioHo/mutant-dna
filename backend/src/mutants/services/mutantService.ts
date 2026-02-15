import MutantsRepository from "../repositories/mutantsRepository.interface";
import MutantDetector from "./mutantDetector.interface";
import MutantsService from "./mutantService.interface";
import { MutantsHashService } from "./mutantsHashService.interface";

export default class DefaultMutantsService implements MutantsService {
  constructor(
    private mutantDetector: MutantDetector,
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

    const result = await this.mutantDetector.isMutant(dna);

    this.mutantsRepository.saveMutant(dna, hash, result);

    return result;
  }
}
