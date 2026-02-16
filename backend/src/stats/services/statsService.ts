import { StatsRepository } from "../repositories/statsRepository.interface.js";
import { StatsService } from "./statsService.interface.js";

export class DefaultStatsService implements StatsService {
  constructor(private statsRepository: StatsRepository) {}

  getStats = async (): Promise<{
    count_mutant_dna: number;
    count_human_dna: number;
    ratio: number;
  }> => {
    const { count_mutant_dna, count_human_dna } =
      await this.statsRepository.getStats();

    // Should this be count_mutant_dna / (count_mutant_dna + count_human_dna) instead?
    // The requirement is ambiguous, but the test cases suggest it's mutant/human.
    // Do we round it to a certain number of decimal places? so we'll return the raw ratio.
    const ratio =
      count_human_dna === 0 ? 0 : count_mutant_dna / count_human_dna;

    return {
      count_mutant_dna,
      count_human_dna,
      ratio,
    };
  };
}
