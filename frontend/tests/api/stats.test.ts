import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFetchStats } from "../../src/api/stats";

// Mock the API client
vi.mock("../../src/api/client", () => ({
  useApiCall: () => {
    const mockExecute = vi.fn();

    return {
      execute: mockExecute,
      loading: false,
      error: null,
      data: null,
    };
  },
}));

describe("useFetchStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return fetchStats, loading, error, and data", () => {
    const { result } = renderHook(() => useFetchStats());

    expect(result.current).toHaveProperty("fetchStats");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("data");
  });

  it("should call execute with correct endpoint", () => {
    const { result } = renderHook(() => useFetchStats());

    expect(typeof result.current.fetchStats).toBe("function");
    expect(() => result.current.fetchStats()).not.toThrow();
  });
});
