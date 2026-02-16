import { DefaultMutantsController } from "../controllers/mutantsController.js";
import { DefaultMutantsRepository } from "../repositories/mutantsRepository.js";
import { DefaultMutantsDetector } from "../services/mutantsDetector.js";
import { DefaultMutantsService } from "../services/mutantsService.js";
import { DefaultMutantsHashService } from "../services/mutantsHashService.js";
import { CacheProvider } from "../../infra/cache/cacheProvider.interface.js";
import { DatabaseProvider } from "../../infra/database/databaseProvider.interface.js";

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
