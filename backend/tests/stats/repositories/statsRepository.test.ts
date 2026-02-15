import { describe, it, expect, vi, beforeEach } from "vitest";
import { DefaultStatsRepository } from "../../../src/stats/repositories/statsRepository";
import { CacheProvider } from "../../../src/infra/cache/cacheProvider.interface";

describe("DefaultStatsRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls query with the expected SQL and returns the first row counts", async () => {
    const mockDatabase = {
      query: vi
        .fn()
        .mockResolvedValue([{ count_mutant_dna: 40, count_human_dna: 100 }]),
    } as unknown as any;

    const mockCache = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
    } as CacheProvider;

    const repo = new DefaultStatsRepository(mockDatabase, mockCache);
    const stats = await repo.getStats();

    expect(mockDatabase.query).toHaveBeenCalledTimes(1);
    const calledSql = mockDatabase.query.mock.calls[0][0] as string;
    expect(calledSql).toContain("FROM mutants");
    expect(calledSql).toContain("SUM(CASE WHEN is_mutant THEN 1 ELSE 0 END)");
    expect(calledSql).toContain(
      "SUM(CASE WHEN NOT is_mutant THEN 1 ELSE 0 END)",
    );
    expect(stats).toEqual({ count_mutant_dna: 40, count_human_dna: 100 });
  });

  it("returns the first row when multiple rows are returned", async () => {
    const mockQuery = vi.fn().mockResolvedValue([
      { count_mutant_dna: 1, count_human_dna: 2 },
      { count_mutant_dna: 999, count_human_dna: 0 },
    ]);
    const mockDatabase = { query: mockQuery } as unknown as any;

    const mockCache = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
    } as CacheProvider;

    const repo = new DefaultStatsRepository(mockDatabase, mockCache);
    const stats = await repo.getStats();

    expect(stats).toEqual({ count_mutant_dna: 1, count_human_dna: 2 });
  });

  it("returns default counts when query returns no rows", async () => {
    const mockQuery = vi.fn().mockResolvedValue([]);
    const mockDatabase = { query: mockQuery } as unknown as any;
    const mockCache = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
    } as CacheProvider;

    const repo = new DefaultStatsRepository(mockDatabase, mockCache);
    const stats = await repo.getStats();

    expect(stats).toEqual({ count_mutant_dna: 0, count_human_dna: 0 });
  });

  it("propagates errors from the query function", async () => {
    const mockQuery = vi.fn().mockRejectedValue(new Error("db error"));
    const mockDatabase = { query: mockQuery } as unknown as any;
    const mockCache = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
    } as CacheProvider;

    const repo = new DefaultStatsRepository(mockDatabase, mockCache);
    await expect(repo.getStats()).rejects.toThrow("db error");
  });

  it("returns cached stats when cache has value and skips database query", async () => {
    const mockQuery = vi.fn();
    const cachedValue = { count_mutant_dna: 10, count_human_dna: 20 };
    const mockCache = {
      get: vi.fn().mockResolvedValue(JSON.stringify(cachedValue)),
      set: vi.fn(),
      del: vi.fn(),
    } as unknown as CacheProvider;

    const mockDatabase = { query: mockQuery } as unknown as any;
    const repo = new DefaultStatsRepository(mockDatabase, mockCache);
    const stats = await repo.getStats();

    expect(mockCache.get).toHaveBeenCalledWith("stats");
    expect(mockQuery).not.toHaveBeenCalled();
    expect(mockCache.set).not.toHaveBeenCalled();
    expect(stats).toEqual(cachedValue);
  });

  it("sets cache when no cached value and query returns a row", async () => {
    const row = { count_mutant_dna: 7, count_human_dna: 3 };
    const mockQuery = vi.fn().mockResolvedValue([row]);
    const mockCache = {
      get: vi.fn().mockResolvedValue(undefined),
      set: vi.fn(),
      del: vi.fn(),
    } as unknown as CacheProvider;

    const mockDatabase = { query: mockQuery } as unknown as any;
    const repo = new DefaultStatsRepository(mockDatabase, mockCache);
    const stats = await repo.getStats();

    expect(mockCache.get).toHaveBeenCalledWith("stats");
    expect(mockQuery).toHaveBeenCalled();
    expect(mockCache.set).toHaveBeenCalledWith("stats", JSON.stringify(row));
    expect(stats).toEqual(row);
  });

  it("returns default counts when query returns no rows (rows empty)", async () => {
    const mockQuery = vi.fn().mockResolvedValue([]);
    const mockCache = {
      get: vi.fn().mockResolvedValue(undefined),
      set: vi.fn(),
      del: vi.fn(),
    } as unknown as CacheProvider;

    const mockDatabase = { query: mockQuery } as unknown as any;
    const repo = new DefaultStatsRepository(mockDatabase, mockCache);
    const stats = await repo.getStats();

    expect(mockCache.get).toHaveBeenCalledWith("stats");
    expect(mockQuery).toHaveBeenCalled();
    expect(mockCache.set).not.toHaveBeenCalled();
    expect(stats).toEqual({ count_mutant_dna: 0, count_human_dna: 0 });
  });
});
