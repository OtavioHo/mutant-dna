import { describe, it, expect, vi, beforeEach } from "vitest";
import DefaultMutantsService from "../../../src/mutants/services/mutantService";
import type MutantDetector from "../../../src/mutants/services/mutantDetector.interface";
import type MutantsRepository from "../../../src/mutants/repositories/mutantsRepository.interface";

describe("DefaultMutantsService", () => {
  let mutantDetector: MutantDetector;
  let mutantsRepository: MutantsRepository;
  let service: DefaultMutantsService;

  beforeEach(() => {
    mutantDetector = {
      isMutant: vi.fn(),
    };
    mutantsRepository = {
      saveMutant: vi.fn(),
    };
    service = new DefaultMutantsService(mutantDetector, mutantsRepository);
  });

  describe("checkDNA", () => {
    it("should return true when DNA is mutant", async () => {
      const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
      vi.mocked(mutantDetector.isMutant).mockResolvedValue(true);

      const result = await service.checkDNA(dna);

      expect(result).toBe(true);
      expect(mutantDetector.isMutant).toHaveBeenCalledWith(dna);
      expect(mutantsRepository.saveMutant).toHaveBeenCalledWith(
        ["test1"],
        "test",
        true,
      );
    });

    it("should return false when DNA is not mutant", async () => {
      const dna = ["ATGCGA", "CAGTGC", "TTATTT", "AGACGG", "GCGTCA", "TCACTG"];
      vi.mocked(mutantDetector.isMutant).mockResolvedValue(false);

      const result = await service.checkDNA(dna);

      expect(result).toBe(false);
      expect(mutantDetector.isMutant).toHaveBeenCalledWith(dna);
      expect(mutantsRepository.saveMutant).toHaveBeenCalledWith(
        ["test1"],
        "test",
        false,
      );
    });

    it("should call saveMutant with correct parameters", async () => {
      const dna = ["ATGCGA"];
      vi.mocked(mutantDetector.isMutant).mockResolvedValue(true);

      await service.checkDNA(dna);

      expect(mutantsRepository.saveMutant).toHaveBeenCalledTimes(1);
      expect(mutantsRepository.saveMutant).toHaveBeenCalledWith(
        ["test1"],
        "test",
        true,
      );
    });
  });
});
