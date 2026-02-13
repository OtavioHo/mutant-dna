export default interface MutantsDetector {
  isMutant(dna: string[]): Promise<boolean>;
}
