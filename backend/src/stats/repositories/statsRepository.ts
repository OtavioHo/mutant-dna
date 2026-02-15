import { CacheProvider } from "../../infra/cache/cacheProvider.interface";
import { StatsRepository } from "./statsRepository.interface";

export class DefaultStatsRepository implements StatsRepository {
  constructor(
    private query: (text: string, params?: any[]) => Promise<any>,
    private cache: CacheProvider,
  ) {}

  getStats = async (): Promise<{
    count_mutant_dna: number;
    count_human_dna: number;
  }> => {
    const cachedStats = await this.cache.get("stats");
    if (cachedStats) {
      console.log("Stats cache hit");
      return JSON.parse(cachedStats);
    }

    const sql = `
      SELECT
        SUM(CASE WHEN is_mutant THEN 1 ELSE 0 END) AS count_mutant_dna,
        SUM(CASE WHEN NOT is_mutant THEN 1 ELSE 0 END) AS count_human_dna
      FROM mutants
    `;

    const result = await this.query(sql);
    if (result.rows && result.rows.length > 0) {
      await this.cache.set("stats", JSON.stringify(result.rows[0]));
      return result.rows[0];
    }

    return {
      count_mutant_dna: 0,
      count_human_dna: 0,
    };
  };
}
