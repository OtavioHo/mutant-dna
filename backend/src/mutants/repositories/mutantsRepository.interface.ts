export default interface MutantsRepository {
  saveMutant(dna: string[], hash: string, isMutant: boolean): Promise<void>;
}
