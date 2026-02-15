import { query } from "../../utils/db";
import { DefaultStatsController } from "../controllers/statsController";
import { DefaultStatsRepository } from "../repositories/statsRepository";
import { DefaultStatsService } from "../services/statsService";

export function buildContainer() {
  const statsRepository = new DefaultStatsRepository(query);
  const statsService = new DefaultStatsService(statsRepository);
  const statsController = new DefaultStatsController(statsService);

  return {
    statsController,
    statsService,
    statsRepository,
  };
}
