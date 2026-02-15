import { createHash } from "crypto";
import { MutantsHashService } from "./mutantsHashService.interface";

export class DefaultMutantsHashService implements MutantsHashService {
  hashDNA(dna: string[]): string {
    const hash = createHash("sha256");
    hash.update(dna.join(","));
    return hash.digest("hex");
  }
}
