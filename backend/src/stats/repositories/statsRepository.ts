import { StatsRepository } from "./statsRepository.interface";

export class DefaultStatsRepository implements StatsRepository {
  constructor(private query: (text: string, params?: any[]) => Promise<any>) {}

  getStats = async (): Promise<{
    count_mutant_dna: number;
    count_human_dna: number;
  }> => {
    const sql = `
      SELECT
        SUM(CASE WHEN is_mutant THEN 1 ELSE 0 END) AS count_mutant_dna,
        SUM(CASE WHEN NOT is_mutant THEN 1 ELSE 0 END) AS count_human_dna
      FROM mutants
    `;

    const result = await this.query(sql);
    return result.rows[0];
  };
}
