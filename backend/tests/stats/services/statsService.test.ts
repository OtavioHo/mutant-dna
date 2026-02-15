import { describe, it, expect, vi } from "vitest";
import { DefaultStatsService } from "../../../src/stats/services/statsService";
import type { StatsRepository } from "../../../src/stats/repositories/statsRepository.interface";

describe("DefaultStatsService", () => {
  it("returns ratio 0 when count_human_dna is 0 (even if mutants > 0) and calls repository", async () => {
    const mockRepo = {
      getStats: vi.fn().mockResolvedValue({
        count_mutant_dna: 5,
        count_human_dna: 0,
      }),
    } as unknown as StatsRepository;

    const service = new DefaultStatsService(mockRepo);
    const result = await service.getStats();

    expect(result).toEqual({
      count_mutant_dna: 5,
      count_human_dna: 0,
      ratio: 0,
    });
    expect(mockRepo.getStats).toHaveBeenCalledTimes(1);
  });

  it("calculates ratio correctly when count_human_dna > 0", async () => {
    const mockRepo = {
      getStats: vi.fn().mockResolvedValue({
        count_mutant_dna: 4,
        count_human_dna: 2,
      }),
    } as unknown as StatsRepository;

    const service = new DefaultStatsService(mockRepo);
    const result = await service.getStats();

    expect(result.count_mutant_dna).toBe(4);
    expect(result.count_human_dna).toBe(2);
    expect(result.ratio).toBe(2);
  });

  it("returns ratio 0 when both counts are 0", async () => {
    const mockRepo = {
      getStats: vi.fn().mockResolvedValue({
        count_mutant_dna: 0,
        count_human_dna: 0,
      }),
    } as unknown as StatsRepository;

    const service = new DefaultStatsService(mockRepo);
    const result = await service.getStats();

    expect(result).toEqual({
      count_mutant_dna: 0,
      count_human_dna: 0,
      ratio: 0,
    });
  });

  it("returns a floating ratio and handles precision", async () => {
    const mockRepo = {
      getStats: vi.fn().mockResolvedValue({
        count_mutant_dna: 1,
        count_human_dna: 3,
      }),
    } as unknown as StatsRepository;

    const service = new DefaultStatsService(mockRepo);
    const result = await service.getStats();

    expect(result.count_mutant_dna).toBe(1);
    expect(result.count_human_dna).toBe(3);
    expect(result.ratio).toBeCloseTo(1 / 3, 10);
  });
});