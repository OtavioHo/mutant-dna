export interface MutantsDetector {
  detect(dna: string[]): Promise<boolean>;
}
