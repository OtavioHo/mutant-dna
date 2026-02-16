import { describe, it, expect, vi, beforeEach } from "vitest";
import { DefaultMutantsService } from "../../../src/mutants/services/mutantsService";
import { MutantsDetector } from "../../../src/mutants/services/mutantsDetector.interface";
import { MutantsRepository } from "../../../src/mutants/repositories/mutantsRepository.interface";
import { MutantsHashService } from "../../../src/mutants/services/mutantsHashService.interface";

describe("DefaultMutantsService", () => {
  let mutantDetector: MutantsDetector;
  let mutantsRepository: MutantsRepository;
  let mutantsHashService: MutantsHashService;
  let service: DefaultMutantsService;

  const DNA_HASH = "DNA_HASH";

  beforeEach(() => {
    mutantDetector = {
      detect: vi.fn(),
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
      vi.mocked(mutantDetector.detect).mockResolvedValue(true);

      const result = await service.checkDNA(dna);

      expect(result).toBe(true);
      expect(mutantDetector.detect).toHaveBeenCalledWith(dna);
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
      expect(mutantDetector.detect).not.toHaveBeenCalled();
      expect(mutantsRepository.saveMutant).not.toHaveBeenCalled();
    });

    it("should return false when DNA is not mutant and dna not in database", async () => {
      const dna = ["ATGCGA", "CAGTGC", "TTATTT", "AGACGG", "GCGTCA", "TCACTG"];
      vi.mocked(mutantDetector.detect).mockResolvedValue(false);
      vi.mocked(mutantsRepository.getMutantByHash).mockResolvedValue(null);

      const result = await service.checkDNA(dna);

      expect(result).toBe(false);
      expect(mutantDetector.detect).toHaveBeenCalledWith(dna);
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
      expect(mutantDetector.detect).not.toHaveBeenCalled();
      expect(mutantsRepository.saveMutant).not.toHaveBeenCalled();
    });

    it("should call saveMutant with correct parameters", async () => {
      const dna = ["ATGCGA"];
      vi.mocked(mutantDetector.detect).mockResolvedValue(true);
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
