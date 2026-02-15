import { describe, it, expect, vi, beforeEach } from "vitest";
import DefaultMutantsService from "../../../src/mutants/services/mutantService";
import type MutantDetector from "../../../src/mutants/services/mutantDetector.interface";
import type MutantsRepository from "../../../src/mutants/repositories/mutantsRepository.interface";
import { MutantsHashService } from "../../../src/mutants/services/mutantsHashService.interface";

describe("DefaultMutantsService", () => {
  let mutantDetector: MutantDetector;
  let mutantsRepository: MutantsRepository;
  let mutantsHashService: MutantsHashService;
  let service: DefaultMutantsService;

  const DNA_HASH = "DNA_HASH";

  beforeEach(() => {
    mutantDetector = {
      isMutant: vi.fn(),
    };
    mutantsRepository = {
      saveMutant: vi.fn(),
      getMutantByHash: vi.fn(),
    };
    mutantsHashService = {
      hashDNA: vi.fn().mockReturnValue(DNA_HASH),
    };
    service = new DefaultMutantsService(
      mutantDetector,
      mutantsRepository,
      mutantsHashService,
    );
  });

  describe("checkDNA", () => {
    it("should return true when DNA is mutant and dna not in database", async () => {
      const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
      vi.mocked(mutantsRepository.getMutantByHash).mockResolvedValue(null);
      vi.mocked(mutantDetector.isMutant).mockResolvedValue(true);

      const result = await service.checkDNA(dna);

      expect(result).toBe(true);
      expect(mutantDetector.isMutant).toHaveBeenCalledWith(dna);
      expect(mutantsRepository.saveMutant).toHaveBeenCalledWith(
        dna,
        DNA_HASH,
        true,
      );
    });

    it("should return true when DNA is mutant and dna is in database", async () => {
      const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
      vi.mocked(mutantsRepository.getMutantByHash).mockResolvedValue({
        is_mutant: true,
      });

      const result = await service.checkDNA(dna);

      expect(result).toBe(true);
      expect(mutantDetector.isMutant).not.toHaveBeenCalled();
      expect(mutantsRepository.saveMutant).not.toHaveBeenCalled();
    });

    it("should return false when DNA is not mutant and dna not in database", async () => {
      const dna = ["ATGCGA", "CAGTGC", "TTATTT", "AGACGG", "GCGTCA", "TCACTG"];
      vi.mocked(mutantDetector.isMutant).mockResolvedValue(false);
      vi.mocked(mutantsRepository.getMutantByHash).mockResolvedValue(null);

      const result = await service.checkDNA(dna);

      expect(result).toBe(false);
      expect(mutantDetector.isMutant).toHaveBeenCalledWith(dna);
      expect(mutantsRepository.saveMutant).toHaveBeenCalledWith(
        dna,
        DNA_HASH,
        false,
      );
    });

    it("should return false when DNA is not mutant and dna is in database", async () => {
      const dna = ["ATGCGA", "CAGTGC", "TTATTT", "AGACGG", "GCGTCA", "TCACTG"];
      vi.mocked(mutantsRepository.getMutantByHash).mockResolvedValue({
        is_mutant: false,
      });

      const result = await service.checkDNA(dna);

      expect(result).toBe(false);
      expect(mutantDetector.isMutant).not.toHaveBeenCalled();
      expect(mutantsRepository.saveMutant).not.toHaveBeenCalled();
    });

    it("should call saveMutant with correct parameters", async () => {
      const dna = ["ATGCGA"];
      vi.mocked(mutantDetector.isMutant).mockResolvedValue(true);
      vi.mocked(mutantsRepository.getMutantByHash).mockResolvedValue(null);

      await service.checkDNA(dna);

      expect(mutantsRepository.saveMutant).toHaveBeenCalledTimes(1);
      expect(mutantsRepository.saveMutant).toHaveBeenCalledWith(
        dna,
        DNA_HASH,
        true,
      );
    });
  });
});
