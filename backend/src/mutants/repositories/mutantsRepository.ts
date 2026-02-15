import { CacheProvider } from "../../infra/cache/cacheProvider.interface";
import { MutantsRepository } from "./mutantsRepository.interface";

export class DefaultMutantsRepository implements MutantsRepository {
  constructor(
    private query: (text: string, params?: any[]) => Promise<any>,
    private cache: CacheProvider,
  ) {}

  saveMutant = async (
    dna: string[],
    hash: string,
    isMutant: boolean,
  ): Promise<void> => {
    const sql = `
        INSERT INTO mutants (dna, dna_hash, is_mutant)
        VALUES ($1, $2, $3)
        ON CONFLICT (dna_hash) DO NOTHING
      `;

    await this.query(sql, [dna, hash, isMutant]);

    // update stats cache
    try {
      const cached = await this.cache.get("stats");
      if (cached) {
        const stats = typeof cached === "string" ? JSON.parse(cached) : cached;
        stats.count_mutant_dna =
          (parseInt(stats.count_mutant_dna) || 0) + (isMutant ? 1 : 0);
        stats.count_human_dna =
          (parseInt(stats.count_human_dna) || 0) + (isMutant ? 0 : 1);
        await this.cache.set("stats", JSON.stringify(stats));
      }
    } catch (err) {
      console.error("Error updating stats cache:", err);
      await this.cache.del("stats");
      console.log("Stats cache invalidated due to error");
    }

    // cache mutant result
    try {
      await this.cache.set(
        `mutant:${hash}`,
        JSON.stringify({ is_mutant: isMutant }),
      );
    } catch (err) {
      console.error("Error caching mutant result:", err);
    }
  };

  getMutantByHash = async (
    hash: string,
  ): Promise<{ is_mutant: boolean } | null> => {
    try {
      const cached = await this.cache.get(`mutant:${hash}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      console.error("Error accessing mutant cache:", err);
    }

    const sql = `
        SELECT is_mutant
        FROM mutants
        WHERE dna_hash = $1
      `;

    const result = await this.query(sql, [hash]);

    if (result && result.rows[0]) {
      try {
        await this.cache.set(`mutant:${hash}`, JSON.stringify(result.rows[0]));
      } catch (err) {
        console.error("Error caching mutant result:", err);
      }
      return result.rows[0];
    }

    return null;
  };
}
