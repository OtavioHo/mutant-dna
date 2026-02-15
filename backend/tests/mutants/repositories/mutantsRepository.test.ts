import { describe, it, expect, vi, beforeEach } from "vitest";
import { DefaultMutantsRepository } from "../../../src/mutants/repositories/mutantsRepository";

describe("DefaultMutantsRepository", () => {
  let mockQuery: ReturnType<typeof vi.fn> &
    ((text: string, params?: any[]) => Promise<any>);
  let repository: DefaultMutantsRepository;

  beforeEach(() => {
    mockQuery = vi.fn() as any;
    repository = new DefaultMutantsRepository(mockQuery);
  });

  describe("saveMutant", () => {
    it("should call query with correct SQL and parameters", async () => {
      const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
      const hash = "abc123";
      const isMutant = true;

      await repository.saveMutant(dna, hash, isMutant);

      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO mutants"),
        [dna, hash, isMutant],
      );
    });

    it("should handle non-mutant DNA", async () => {
      const dna = ["ATGCGA", "CAGTGC", "TTATTT", "AGACGG", "GCGTCA", "TCACTG"];
      const hash = "def456";
      const isMutant = false;

      await repository.saveMutant(dna, hash, isMutant);

      expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [
        dna,
        hash,
        isMutant,
      ]);
    });

    it("should include ON CONFLICT clause in SQL", async () => {
      const dna = ["ATGCGA"];
      const hash = "hash123";
      const isMutant = true;

      await repository.saveMutant(dna, hash, isMutant);

      const sqlQuery = mockQuery.mock.calls[0][0];
      expect(sqlQuery).toContain("ON CONFLICT (dna_hash) DO NOTHING");
    });

    it("should propagate errors from query", async () => {
      const error = new Error("Database error");
      mockQuery.mockRejectedValueOnce(error);

      await expect(
        repository.saveMutant(["ATGCGA"], "hash", true),
      ).rejects.toThrow("Database error");
    });
  });

  describe("getMutantByHash", () => {
    it("should return mutant data when hash exists", async () => {
      const hash = "existingHash";
      const expectedResult = { is_mutant: true };
      mockQuery.mockResolvedValueOnce({ rows: [expectedResult] });

      const result = await repository.getMutantByHash(hash);

      expect(result).toEqual(expectedResult);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT is_mutant"),
        [hash],
      );
    });

    it("should return null when hash does not exist", async () => {
      const hash = "nonExistingHash";
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await repository.getMutantByHash(hash);

      expect(result).toBeNull();
    });

    it("should propagate errors from query", async () => {
      const error = new Error("Database error");
      mockQuery.mockRejectedValueOnce(error);

      await expect(repository.getMutantByHash("hash")).rejects.toThrow(
        "Database error",
      );
    });
  });
});
