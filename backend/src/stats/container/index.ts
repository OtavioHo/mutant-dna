import { CacheProvider } from "../../infra/cache/cacheProvider.interface";
import { query } from "../../infra/db";
import { DefaultStatsController } from "../controllers/statsController";
import { DefaultStatsRepository } from "../repositories/statsRepository";
import { DefaultStatsService } from "../services/statsService";

export function buildContainer(cacheProvider: CacheProvider) {
  const statsRepository = new DefaultStatsRepository(query, cacheProvider);
  const statsService = new DefaultStatsService(statsRepository);
  const statsController = new DefaultStatsController(statsService);

  return {
    statsController,
    statsService,
    statsRepository,
  };
}
