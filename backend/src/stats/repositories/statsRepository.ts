import { CacheProvider } from "../../infra/cache/cacheProvider.interface";
import { DatabaseProvider } from "../../infra/database/databaseProvider.interface";
import { StatsRepository } from "./statsRepository.interface";

export class DefaultStatsRepository implements StatsRepository {
  constructor(
    private database: DatabaseProvider,
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

    const result = await this.database.query<{
      count_mutant_dna: number;
      count_human_dna: number;
    }>(sql);
    if (result && result.length > 0) {
      await this.cache.set("stats", JSON.stringify(result[0]));
      return result[0];
    }

    return {
      count_mutant_dna: 0,
      count_human_dna: 0,
    };
  };
}
