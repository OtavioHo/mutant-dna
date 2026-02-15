import { CacheProvider } from "../../infra/cache/cacheProvider.interface";
import { DatabaseProvider } from "../../infra/database/databaseProvider.interface";
import { DefaultStatsController } from "../controllers/statsController";
import { DefaultStatsRepository } from "../repositories/statsRepository";
import { DefaultStatsService } from "../services/statsService";

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
