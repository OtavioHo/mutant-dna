import { CacheProvider } from "../../infra/cache/cacheProvider.interface.js";
import { DatabaseProvider } from "../../infra/database/databaseProvider.interface.js";
import { DefaultStatsController } from "../controllers/statsController.js";
import { DefaultStatsRepository } from "../repositories/statsRepository.js";
import { DefaultStatsService } from "../services/statsService.js";

export function buildContainer(
  databaseProvider: DatabaseProvider,
  cacheProvider: CacheProvider,
) {
  const statsRepository = new DefaultStatsRepository(
    databaseProvider,
    cacheProvider,
  );
  const statsService = new DefaultStatsService(statsRepository);
  const statsController = new DefaultStatsController(statsService);

  return {
    statsController,
    statsService,
    statsRepository,
  };
}
