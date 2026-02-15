import { describe, it, expect, vi, beforeEach } from "vitest";
import { DefaultMutantsRepository } from "../../../src/mutants/repositories/mutantsRepository";
import { CacheProvider } from "../../../src/infra/cache/cacheProvider.interface";
import { afterEach } from "node:test";
import { DatabaseProvider } from "../../../src/infra/database/databaseProvider.interface";

describe("DefaultMutantsRepository", () => {
  let mockQuery: ReturnType<typeof vi.fn> &
    ((text: string, params?: any[]) => Promise<any>);
  let mockCache: ReturnType<typeof vi.fn> & CacheProvider;
  let repository: DefaultMutantsRepository;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let mockDatabase: { query: typeof mockQuery } & DatabaseProvider;

  beforeEach(() => {
    mockQuery = vi.fn() as any;
    mockCache = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
    } as any;
    mockDatabase = { query: mockQuery } as unknown as any;
    repository = new DefaultMutantsRepository(mockDatabase, mockCache);

    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
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
      expect(mockCache.set).toHaveBeenCalledWith(
        `mutant:${hash}`,
        JSON.stringify({ is_mutant: isMutant }),
      );
    });

    it("should update stats cache when saving mutant", async () => {
      const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
      const hash = "abc123";
      const isMutant = true;

      (
        mockCache.get as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(
        JSON.stringify({ count_mutant_dna: 10, count_human_dna: 20 }),
      );

      await repository.saveMutant(dna, hash, isMutant);

      expect(mockCache.get).toHaveBeenCalledWith("stats");
      expect(mockCache.set).toHaveBeenCalledWith(
        "stats",
        JSON.stringify({ count_mutant_dna: 11, count_human_dna: 20 }),
      );
    });

    it("should update stats cache when saving human DNA", async () => {
      const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
      const hash = "abc123";
      const isMutant = false;

      (
        mockCache.get as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(
        JSON.stringify({ count_mutant_dna: 10, count_human_dna: 20 }),
      );

      await repository.saveMutant(dna, hash, isMutant);

      expect(mockCache.get).toHaveBeenCalledWith("stats");
      expect(mockCache.set).toHaveBeenCalledWith(
        "stats",
        JSON.stringify({ count_mutant_dna: 10, count_human_dna: 21 }),
      );
    });

    it("should update stats cache when saving mutant with empty stats", async () => {
      const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
      const hash = "abc123";
      const isMutant = true;

      (
        mockCache.get as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(JSON.stringify({}));

      await repository.saveMutant(dna, hash, isMutant);

      expect(mockCache.get).toHaveBeenCalledWith("stats");
      expect(mockCache.set).toHaveBeenCalledWith(
        "stats",
        JSON.stringify({ count_mutant_dna: 1, count_human_dna: 0 }),
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
      expect(mockCache.set).toHaveBeenCalledWith(
        `mutant:${hash}`,
        JSON.stringify({ is_mutant: isMutant }),
      );
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

    it("should handle errors when updating stats cache", async () => {
      const error = new Error("Cache error");
      (
        mockCache.get as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(
        JSON.stringify({ count_mutant_dna: 5, count_human_dna: 10 }),
      );
      (
        mockCache.set as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValueOnce(error);

      await repository.saveMutant(["ATGCGA"], "hash", true);

      expect(mockCache.get).toHaveBeenCalledWith("stats");
      expect(mockCache.set).toHaveBeenCalledWith(
        "stats",
        JSON.stringify({ count_mutant_dna: 6, count_human_dna: 10 }),
      );
      expect(mockCache.del).toHaveBeenCalledWith("stats");
    });

    it("should handle errors when caching mutant result", async () => {
      const error = new Error("Cache error");
      (mockCache.set as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
        error,
      );

      await repository.saveMutant(["ATGCGA"], "hash", true);

      expect(mockCache.set).toHaveBeenCalledWith(
        `mutant:hash`,
        JSON.stringify({ is_mutant: true }),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error caching mutant result:",
        error,
      );
    });
  });

  describe("getMutantByHash", () => {
    it("should return mutant data when hash exists", async () => {
      const hash = "existingHash";
      const expectedResult = { is_mutant: true };
      mockQuery.mockResolvedValueOnce([expectedResult]);

      const result = await repository.getMutantByHash(hash);

      expect(result).toEqual(expectedResult);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT is_mutant"),
        [hash],
      );
    });

    it("should return mutant data from cache when available", async () => {
      const hash = "cachedHash";
      const cachedValue = { is_mutant: false };
      (
        mockCache.get as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(JSON.stringify(cachedValue));

      const result = await repository.getMutantByHash(hash);

      expect(mockCache.get).toHaveBeenCalledWith(`mutant:${hash}`);
      expect(result).toEqual(cachedValue);
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it("should return null when hash does not exist", async () => {
      const hash = "nonExistingHash";
      mockQuery.mockResolvedValueOnce([]);

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

    it("should handle errors when accessing mutant cache", async () => {
      const error = new Error("Cache error");
      (
        mockCache.get as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValueOnce(error);

      const result = await repository.getMutantByHash("hash");

      expect(mockCache.get).toHaveBeenCalledWith(`mutant:hash`);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error accessing mutant cache:",
        error,
      );
      expect(result).toBeNull();
    });

    it("should cache mutant result after fetching from database", async () => {
      const hash = "dbHash";
      const dbResult = { is_mutant: true };
      mockQuery.mockResolvedValueOnce([dbResult]);

      const result = await repository.getMutantByHash(hash);

      expect(result).toEqual(dbResult);
      expect(mockCache.set).toHaveBeenCalledWith(
        `mutant:${hash}`,
        JSON.stringify(dbResult),
      );
    });

    it("should handle error on setting mutant cache after fetching from database", async () => {
      const hash = "dbHash";
      const dbResult = { is_mutant: true };
      const error = new Error("Cache error");
      mockQuery.mockResolvedValueOnce([dbResult]);
      (
        mockCache.set as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValueOnce(error);

      const result = await repository.getMutantByHash(hash);

      expect(result).toEqual(dbResult);
      expect(mockCache.set).toHaveBeenCalledWith(
        `mutant:${hash}`,
        JSON.stringify(dbResult),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error caching mutant result:",
        error,
      );
    });
  });
  describe("saveMutant (additional cases)", () => {
    it("should not update stats cache when stats missing", async () => {
      (
        mockCache.get as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce(null);

      await repository.saveMutant(
        ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"],
        "hash1",
        true,
      );

      expect(mockCache.get).toHaveBeenCalledWith("stats");
      expect(mockCache.set).toHaveBeenCalledWith(
        `mutant:hash1`,
        JSON.stringify({ is_mutant: true }),
      );
      expect(mockCache.set).not.toHaveBeenCalledWith(
        "stats",
        expect.anything(),
      );
    });

    it("should handle stats cached as object (non-string)", async () => {
      (
        mockCache.get as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({ count_mutant_dna: 2, count_human_dna: 3 });

      await repository.saveMutant(["ATGCGA"], "hashObj", true);

      expect(mockCache.get).toHaveBeenCalledWith("stats");
      expect(mockCache.set).toHaveBeenCalledWith(
        "stats",
        JSON.stringify({ count_mutant_dna: 3, count_human_dna: 3 }),
      );
    });

    it("should handle error when getting stats cache (invalidate stats)", async () => {
      const error = new Error("Get error");
      (
        mockCache.get as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValueOnce(error);

      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});

      await repository.saveMutant(["ATGCGA"], "hashErr", true);

      expect(mockCache.get).toHaveBeenCalledWith("stats");
      expect(mockCache.del).toHaveBeenCalledWith("stats");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error updating stats cache:",
        error,
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Stats cache invalidated due to error",
      );

      consoleLogSpy.mockRestore();
    });
  });
});
