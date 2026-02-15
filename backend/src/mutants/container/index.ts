import { DefaultMutantsController } from "../controllers/mutantsController";
import { DefaultMutantsRepository } from "../repositories/mutantsRepository";
import { DefaultMutantsDetector } from "../services/mutantsDetector";
import { DefaultMutantsService } from "../services/mutantsService";
import { DefaultMutantsHashService } from "../services/mutantsHashService";
import { CacheProvider } from "../../infra/cache/cacheProvider.interface";
import { DatabaseProvider } from "../../infra/database/databaseProvider.interface";

export default function buildContainer(
  databaseProvider: DatabaseProvider,
  cacheProvider: CacheProvider,
) {
  const detector = new DefaultMutantsDetector();
  const mutantsRepository = new DefaultMutantsRepository(
    databaseProvider,
    cacheProvider,
  );
  const mutantsHashService = new DefaultMutantsHashService();
  const mutantsService = new DefaultMutantsService(
    detector,
    mutantsRepository,
    mutantsHashService,
  );
  const mutantsController = new DefaultMutantsController(mutantsService);

  return {
    mutantsService,
    mutantsController,
    mutantsRepository,
  };
}
