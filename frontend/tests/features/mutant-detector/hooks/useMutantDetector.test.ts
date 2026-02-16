import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMutantDetector } from "../../../../src/features/mutant-detector/hooks/useMutantDetector";

describe("useMutantDetector", () => {
  it("should initialize with empty values", () => {
    const { result } = renderHook(() => useMutantDetector());

    expect(result.current.dna).toEqual([]);
    expect(result.current.inputValue).toBe("");
    expect(result.current.valid).toBe(false);
  });

  it("should update inputValue when handleInputChange is called", () => {
    const { result } = renderHook(() => useMutantDetector());

    act(() => {
      result.current.handleInputChange("ATGCGA");
    });

    expect(result.current.inputValue).toBe("ATGCGA");
  });

  it("should filter invalid characters", () => {
    const { result } = renderHook(() => useMutantDetector());

    act(() => {
      result.current.handleInputChange("ATG123CGA");
    });

    expect(result.current.inputValue).toBe("ATGCGA");
  });

  it("should convert input to uppercase", () => {
    const { result } = renderHook(() => useMutantDetector());

    act(() => {
      result.current.handleInputChange("atgcga");
    });

    expect(result.current.inputValue).toBe("ATGCGA");
  });

  it("should parse comma-separated DNA strings", () => {
    const { result } = renderHook(() => useMutantDetector());

    act(() => {
      result.current.handleInputChange("ATGCGA,CAGTGC,TTATGT");
    });

    expect(result.current.dna).toEqual(["ATGCGA", "CAGTGC", "TTATGT"]);
  });

  it("should parse newline-separated DNA strings", () => {
    const { result } = renderHook(() => useMutantDetector());

    act(() => {
      result.current.handleInputChange("ATGCGA\nCAGTGC\nTTATGT");
    });

    expect(result.current.dna).toEqual(["ATGCGA", "CAGTGC", "TTATGT"]);
  });

  it("should validate DNA sequence correctly", () => {
    const { result } = renderHook(() => useMutantDetector());

    act(() => {
      result.current.handleInputChange("ATG\nCGA\nTTT");
    });

    expect(result.current.valid).toBe(true);
  });

  it("should invalidate non-square DNA sequence", () => {
    const { result } = renderHook(() => useMutantDetector());

    act(() => {
      result.current.handleInputChange("ATGC\nCGA\nTTT");
    });

    expect(result.current.valid).toBe(false);
  });

  it("should invalidate empty DNA sequence", () => {
    const { result } = renderHook(() => useMutantDetector());

    act(() => {
      result.current.handleInputChange("");
    });

    expect(result.current.valid).toBe(false);
  });
});
