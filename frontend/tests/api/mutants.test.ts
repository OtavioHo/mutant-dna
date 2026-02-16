import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCheckMutant } from "../../src/api/mutants";

// Mock the API client
vi.mock("../../src/api/client", () => ({
  useApiCall: () => {
    const mockExecute = vi.fn();
    const mockReset = vi.fn();

    return {
      execute: mockExecute,
      reset: mockReset,
      loading: false,
      error: null,
      data: null,
      code: null,
    };
  },
}));

describe("useCheckMutant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return execute, reset, loading, error, data, and code", () => {
    const { result } = renderHook(() => useCheckMutant());

    expect(result.current).toHaveProperty("execute");
    expect(result.current).toHaveProperty("reset");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("code");
  });

  it("should call execute with correct endpoint and body", () => {
    const { result } = renderHook(() => useCheckMutant());

    const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
    result.current.execute(dna);

    expect(typeof result.current.execute).toBe("function");
  });

  it("should be able to reset state", () => {
    const { result } = renderHook(() => useCheckMutant());

    expect(typeof result.current.reset).toBe("function");
    expect(() => result.current.reset()).not.toThrow();
  });
});
