import MutantDetector from "./mutantDetector.interface";

export default class DefaultMutantDetector implements MutantDetector {
  async isMutant(dna: string[]): Promise<boolean> {
    return Promise.resolve(true); // Placeholder: Implement the actual mutant detection logic here
  }
}
