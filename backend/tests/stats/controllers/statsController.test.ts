import { describe, it, expect, vi } from "vitest";
import { DefaultStatsController } from "../../../src/stats/controllers/statsController";

const sampleStats = {
  count_mutant_dna: 40,
  count_human_dna: 100,
  ratio: 0.4,
};

describe("DefaultStatsController", () => {
  it("returns stats from service", async () => {
    const service = { getStats: vi.fn().mockResolvedValue(sampleStats) };
    const controller = new DefaultStatsController(service as any);
    const result = await controller.getStats();
    expect(result).toEqual(sampleStats);
    expect(service.getStats).toHaveBeenCalledTimes(1);
  });

  it("propagates errors from service", async () => {
    const service = {
      getStats: vi.fn().mockRejectedValue(new Error("service failure")),
    };
    const controller = new DefaultStatsController(service as any);
    await expect(controller.getStats()).rejects.toThrow("service failure");
    expect(service.getStats).toHaveBeenCalledTimes(1);
  });

  it("getStats remains bound when extracted", async () => {
    const service = { getStats: vi.fn().mockResolvedValue(sampleStats) };
    const controller = new DefaultStatsController(service as any);
    const { getStats } = controller;
    const result = await getStats();
    expect(result).toEqual(sampleStats);
    expect(service.getStats).toHaveBeenCalledTimes(1);
  });
});
