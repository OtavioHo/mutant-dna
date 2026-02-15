export interface MutantsDetector {
  isMutant(dna: string[]): Promise<boolean>;
}
