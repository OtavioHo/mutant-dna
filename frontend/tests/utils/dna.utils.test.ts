import { describe, it, expect } from "vitest";
import {
  isValidDnaSequence,
  parseDnaInput,
  filterDnaInput,
} from "../../src/utils/dna.utils";

describe("dna.utils", () => {
  describe("isValidDnaSequence", () => {
    it("should return false for empty array", () => {
      expect(isValidDnaSequence([])).toBe(false);
    });

    it("should return true for valid DNA sequence", () => {
      const validDna = [
        "ATGCGA",
        "CAGTGC",
        "TTATGT",
        "AGAAGG",
        "CCCCTA",
        "TCACTG",
      ];
      expect(isValidDnaSequence(validDna)).toBe(true);
    });

    it("should return false for invalid characters", () => {
      const invalidDna = [
        "ATGCGA",
        "CAXTGC",
        "TTATGT",
        "AGAAGG",
        "CCCCTA",
        "TCACTG",
      ];
      expect(isValidDnaSequence(invalidDna)).toBe(false);
    });

    it("should return false for non-square matrix", () => {
      const invalidDna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA"];
      expect(isValidDnaSequence(invalidDna)).toBe(false);
    });

    it("should return false for different row lengths", () => {
      const invalidDna = [
        "ATGCGA",
        "CAGTGC",
        "TTATG",
        "AGAAGG",
        "CCCCTA",
        "TCACTG",
      ];
      expect(isValidDnaSequence(invalidDna)).toBe(false);
    });

    it("should handle single character DNA", () => {
      const singleCharDna = ["A"];
      expect(isValidDnaSequence(singleCharDna)).toBe(true);
    });

    it("should handle 2x2 DNA matrix", () => {
      const smallDna = ["AT", "GC"];
      expect(isValidDnaSequence(smallDna)).toBe(true);
    });
  });

  describe("parseDnaInput", () => {
    it("should parse comma-separated DNA strings", () => {
      const input = "ATGCGA,CAGTGC,TTATGT";
      const result = parseDnaInput(input);
      expect(result).toEqual(["ATGCGA", "CAGTGC", "TTATGT"]);
    });

    it("should parse newline-separated DNA strings", () => {
      const input = "ATGCGA\nCAGTGC\nTTATGT";
      const result = parseDnaInput(input);
      expect(result).toEqual(["ATGCGA", "CAGTGC", "TTATGT"]);
    });

    it("should filter out empty lines", () => {
      const input = "ATGCGA\n\nCAGTGC\n\nTTATGT";
      const result = parseDnaInput(input);
      expect(result).toEqual(["ATGCGA", "CAGTGC", "TTATGT"]);
    });

    it("should trim whitespace from each line", () => {
      const input = "  ATGCGA  ,  CAGTGC  ,  TTATGT  ";
      const result = parseDnaInput(input);
      expect(result).toEqual(["ATGCGA", "CAGTGC", "TTATGT"]);
    });

    it("should return empty array for empty input", () => {
      const input = "";
      const result = parseDnaInput(input);
      expect(result).toEqual([]);
    });

    it("should handle mixed separators", () => {
      const input = "ATGCGA,CAGTGC\nTTATGT";
      const result = parseDnaInput(input);
      expect(result).toEqual(["ATGCGA", "CAGTGC", "TTATGT"]);
    });
  });

  describe("filterDnaInput", () => {
    it("should filter out invalid characters", () => {
      const input = "ATGCGA123";
      const result = filterDnaInput(input);
      expect(result).toBe("ATGCGA");
    });

    it("should convert to uppercase", () => {
      const input = "atgcga";
      const result = filterDnaInput(input);
      expect(result).toBe("ATGCGA");
    });

    it("should preserve commas and newlines", () => {
      const input = "atgcga,cagtgc\nttatgt";
      const result = filterDnaInput(input);
      expect(result).toBe("ATGCGA,CAGTGC\nTTATGT");
    });

    it("should remove special characters but keep valid DNA chars", () => {
      const input = "A@T#G$C%G^A&*()";
      const result = filterDnaInput(input);
      expect(result).toBe("ATGCGA");
    });

    it("should handle empty string", () => {
      const input = "";
      const result = filterDnaInput(input);
      expect(result).toBe("");
    });

    it("should allow only AGCT letters", () => {
      const input = "ATGCGAXYZ";
      const result = filterDnaInput(input);
      expect(result).toBe("ATGCGA");
    });
  });
});
