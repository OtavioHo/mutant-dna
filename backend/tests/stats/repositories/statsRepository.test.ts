import { describe, it, expect, vi, beforeEach } from "vitest";
import { DefaultStatsRepository } from "../../../src/stats/repositories/statsRepository";

describe("DefaultStatsRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls query with the expected SQL and returns the first row counts", async () => {
    const mockQuery = vi.fn().mockResolvedValue({
      rows: [{ count_mutant_dna: 40, count_human_dna: 100 }],
    });

    const repo = new DefaultStatsRepository(mockQuery);
    const stats = await repo.getStats();

    expect(mockQuery).toHaveBeenCalledTimes(1);
    const calledSql = mockQuery.mock.calls[0][0] as string;
    expect(calledSql).toContain("FROM mutants");
    expect(calledSql).toContain("SUM(CASE WHEN is_mutant THEN 1 ELSE 0 END)");
    expect(calledSql).toContain("SUM(CASE WHEN NOT is_mutant THEN 1 ELSE 0 END)");
    expect(stats).toEqual({ count_mutant_dna: 40, count_human_dna: 100 });
  });

  it("returns the first row when multiple rows are returned", async () => {
    const mockQuery = vi.fn().mockResolvedValue({
      rows: [
        { count_mutant_dna: 1, count_human_dna: 2 },
        { count_mutant_dna: 999, count_human_dna: 0 },
      ],
    });

    const repo = new DefaultStatsRepository(mockQuery);
    const stats = await repo.getStats();

    expect(stats).toEqual({ count_mutant_dna: 1, count_human_dna: 2 });
  });

  it("returns undefined when query returns no rows", async () => {
    const mockQuery = vi.fn().mockResolvedValue({ rows: [] });

    const repo = new DefaultStatsRepository(mockQuery);
    const stats = await repo.getStats();

    expect(stats).toBeUndefined();
  });

  it("propagates errors from the query function", async () => {
    const mockQuery = vi.fn().mockRejectedValue(new Error("db error"));

    const repo = new DefaultStatsRepository(mockQuery);
    await expect(repo.getStats()).rejects.toThrow("db error");
  });
});