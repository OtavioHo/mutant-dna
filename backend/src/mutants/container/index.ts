import { query } from "../../utils/db";
import { DefaultMutantsController } from "../controllers/mutantsController";
import { DefaultMutantsRepository } from "../repositories/mutantsRepository";
import { DefaultMutantsDetector } from "../services/mutantsDetector";
import { DefaultMutantsService } from "../services/mutantsService";
import { DefaultMutantsHashService } from "../services/mutantsHashService";

export default function buildContainer() {
  const detector = new DefaultMutantsDetector();
  const mutantsRepository = new DefaultMutantsRepository(query);
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
