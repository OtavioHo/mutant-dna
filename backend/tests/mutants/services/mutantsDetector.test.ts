import { describe, it, expect } from "vitest";
import { DefaultMutantsDetector } from "../../../src/mutants/services/mutantsDetector";

describe("DefaultMutantsDetector", () => {
  const detector = new DefaultMutantsDetector();

  it("should return a boolean", async () => {
    const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
    const result = await detector.detect(dna);
    expect(typeof result).toBe("boolean");
  });

  it("should handle empty DNA array", async () => {
    const dna: string[] = [];
    const result = await detector.detect(dna);
    expect(typeof result).toBe("boolean");
    expect(result).toBe(false);
  });

  it("should handle single row DNA", async () => {
    const dna = ["ATGCGA"];
    const result = await detector.detect(dna);
    expect(typeof result).toBe("boolean");
    expect(result).toBe(false);
  });

  it("should handle valid DNA sequences", async () => {
    const dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
    const result = await detector.detect(dna);
    expect(result).toBeDefined();
    expect(result).toBe(true);
  });

  it("should handle invalid DNA sequences (non-square)", async () => {
    const dna = ["ATGCGA", "CAGTGC", "TTATGT"];
    const result = await detector.detect(dna);
    expect(result).toBeDefined();
    expect(result).toBe(false);
  });

  it("should handle non-mutant DNA sequences", async () => {
    const dna = ["ATGCGA", "CAGTGC", "TTATTT", "AGACGG", "GCGTCA", "TCACTG"];
    const result = await detector.detect(dna);
    expect(result).toBeDefined();
    expect(result).toBe(false);
  });

  it("should handle matrices smaller than 4x4", async () => {
    const dna = ["ATG", "CAG", "TTA"];
    const result = await detector.detect(dna);
    expect(result).toBeDefined();
    expect(result).toBe(false);
  });

  it("detects two horizontal sequences (mutant)", async () => {
    const dna = [
      "AAAAAA", // horizontal sequence of A's
      "CAGTGC",
      "TTATGT",
      "AGAAGG",
      "CCCCTA", // horizontal sequence of C's
      "TCACTG",
    ];
    const result = await detector.detect(dna);
    expect(result).toBe(true);
  });

  it("detects two vertical sequences (mutant)", async () => {
    const dna = [
      "AAGA",
      "AAGA",
      "AAGA",
      "AAGA", // columns 0 and 3 are 'A' repeated 4 times
    ];
    const result = await detector.detect(dna);
    expect(result).toBe(true);
  });

  it("detects main diagonal (top-left to bottom-right) and anti-diagonal (mutant)", async () => {
    const dna = [
      "ACCB",
      "CABC",
      "CBAC",
      "BCCA", // main diag A, anti-diag B => two diagonal sequences
    ];
    const result = await detector.detect(dna);
    expect(result).toBe(true);
  });

  it("detects anti-diagonal (top-right to bottom-left) alone needs another sequence to be mutant", async () => {
    const dna = [
      "TTTA",
      "TAAT",
      "TATT",
      "ATTT", // anti-diagonal A, but only one sequence -> not mutant
    ];
    const result = await detector.detect(dna);
    expect(result).toBe(false);
  });

  it("minimal 4x4 non-mutant matrix is handled correctly", async () => {
    const dna = ["ATCG", "TAGC", "CGAT", "GCAT"];
    const result = await detector.detect(dna);
    expect(result).toBe(false);
  });

  it("single long run does not count as two sequences (overlapping handling)", async () => {
    const dna = [
      "AAAAA", // single long horizontal run should count as 1 sequence only
      "CAGTC",
      "TTGTA",
      "AGACG",
      "GTCAG",
    ];
    const result = await detector.detect(dna);
    expect(result).toBe(false);
  });

  it("separate horizontal sequences in different rows are counted (mutant)", async () => {
    const dna = [
      "AAAABB", // 'AAAA' at start
      "CCCCDD", // 'CCCC' at start -> second sequence
      "TTGATT",
      "AGACAG",
      "GTCAGT",
      "TTACTG",
    ];
    const result = await detector.detect(dna);
    expect(result).toBe(true);
  });

  it("detects two diagonal sequences (top-left to bottom-right) in non-main diagonals", async () => {
    const dna = ["AAAAGA", "CAATGC", "GCAAGT", "TTGAAG", "CACCAA", "TCACTA"];
    const result = await detector.detect(dna);
    expect(result).toBe(true);
  });
});
