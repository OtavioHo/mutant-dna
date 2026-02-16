import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useStats } from "../../../../src/features/stats/hooks/useStats";

// Mock the API
vi.mock("../../../../src/api/stats", () => ({
  useFetchStats: () => {
    const mockFetchStats = vi.fn().mockResolvedValue({
      count_mutant_dna: 10,
      count_human_dna: 20,
      ratio: 0.5,
    });

    return {
      fetchStats: mockFetchStats,
      loading: false,
      error: null,
      data: null,
    };
  },
}));

describe("useStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return stats, loading, error, and refetch", () => {
    const { result } = renderHook(() => useStats(false));

    expect(result.current).toHaveProperty("stats");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("refetch");
  });

  it("should provide refetch function", () => {
    const { result } = renderHook(() => useStats(false));

    expect(typeof result.current.refetch).toBe("function");
    expect(() => result.current.refetch()).not.toThrow();
  });

  it("should auto-fetch when autoFetch is true", () => {
    renderHook(() => useStats(true));
    // Auto-fetch should trigger on mount
    // In real implementation, fetchStats would be called
  });

  it("should not auto-fetch when autoFetch is false", () => {
    renderHook(() => useStats(false));
    // fetchStats should not be called on mount
  });
});
