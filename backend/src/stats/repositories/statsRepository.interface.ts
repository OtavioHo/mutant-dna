export interface StatsRepository {
  getStats(): Promise<{
    count_mutant_dna: number;
    count_human_dna: number;
  }>;
}
