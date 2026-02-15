export interface MutantsService {
  checkDNA(dna: string[]): Promise<boolean>;
}
