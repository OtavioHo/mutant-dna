import { query } from "../../utils/db";
import DefaultMutantsController from "../controllers/mutantController";
import DefaultMutantsRepository from "../repositories/mutantsRepository";
import DefaultMutantsDetector from "../services/mutantDetector";
import DefaultMutantsService from "../services/mutantService";

export default function buildContainer() {
  const detector = new DefaultMutantsDetector();
  const mutantsRepository = new DefaultMutantsRepository(query);
  const mutantsService = new DefaultMutantsService(detector, mutantsRepository);
  const mutantsController = new DefaultMutantsController(mutantsService);

  return {
    mutantsService,
    mutantsController,
    mutantsRepository,
  };
}
