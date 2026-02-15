export interface StatsController {
  getStats(): Promise<{
    count_mutant_dna: number;
    count_human_dna: number;
    ratio: number;
  }>;
}
