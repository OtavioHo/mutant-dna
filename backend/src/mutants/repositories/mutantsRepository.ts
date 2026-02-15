import MutantsRepository from "./mutantsRepository.interface";

export default class DefaultMutantsRepository implements MutantsRepository {
  constructor(private query: (text: string, params?: any[]) => Promise<any>) {}

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
  };

  getMutantByHash = async (
    hash: string,
  ): Promise<{ is_mutant: boolean } | null> => {
    const sql = `
        SELECT is_mutant
        FROM mutants
        WHERE dna_hash = $1
      `;

    const result = await this.query(sql, [hash]);
    return result.rows[0] || null;
  };
}
