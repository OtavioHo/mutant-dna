import { StatsService } from "../services/statsService.interface.js";
import { StatsController } from "./statsController.interface.js";

export class DefaultStatsController implements StatsController {
  constructor(private statsService: StatsService) {}

  getStats = async (): Promise<{
    count_mutant_dna: number;
    count_human_dna: number;
    ratio: number;
  }> => {
    return await this.statsService.getStats();
  };
}
