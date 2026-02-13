import { describe, it, expect } from "vitest";
import DefaultMutantDetector from "../../../src/mutants/services/mutantDetector";

describe("DefaultMutantDetector", () => {
  const detector = new DefaultMutantDetector();

  it("should return a boolean", async () => {
    const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
    const result = await detector.isMutant(dna);
    expect(typeof result).toBe("boolean");
  });

  it("should handle empty DNA array", async () => {
    const dna: string[] = [];
    const result = await detector.isMutant(dna);
    expect(typeof result).toBe("boolean");
  });

  it("should handle single row DNA", async () => {
    const dna = ["ATGCGA"];
    const result = await detector.isMutant(dna);
    expect(typeof result).toBe("boolean");
  });

  it("should handle valid DNA sequences", async () => {
    const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
    const result = await detector.isMutant(dna);
    expect(result).toBeDefined();
  });

  it("should return Promise", () => {
    const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
    const result = detector.isMutant(dna);
    expect(result).toBeInstanceOf(Promise);
  });
});
