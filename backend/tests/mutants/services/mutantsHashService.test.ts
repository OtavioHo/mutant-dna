import { describe, it, expect } from "vitest";
import { DefaultMutantsHashService } from "../../../src/mutants/services/mutantsHashService";

const service = new DefaultMutantsHashService();

describe("DefaultMutantsHashService", () => {
  it("returns a deterministic sha256 hex string for the same dna array", () => {
    const dna = ["ATGC", "CCTA", "GGTA"];
    const h1 = service.hashDNA(dna);
    const h2 = service.hashDNA([...dna]);
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[0-9a-f]{64}$/);
  });

  it("returns different hashes for different dna arrays", () => {
    const hA = service.hashDNA(["AAAA"]);
    const hB = service.hashDNA(["TTTT"]);
    expect(hA).not.toBe(hB);
  });
});
