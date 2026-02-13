export default interface MutantsService {
  checkDNA(dna: string[]): Promise<boolean>;
}
