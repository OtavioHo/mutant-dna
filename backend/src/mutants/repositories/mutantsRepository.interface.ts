export default interface MutantsRepository {
  saveMutant(dna: string[], hash: string, isMutant: boolean): Promise<void>;
  getMutantByHash(hash: string): Promise<{ is_mutant: boolean } | null>;
}
