import { Pool } from "pg";
import { DatabaseProvider } from "./databaseProvider.interface.js";

export class PostgresProvider implements DatabaseProvider {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || undefined,
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
      max: process.env.PG_MAX ? Number(process.env.PG_MAX) : 10,
      idleTimeoutMillis: process.env.PG_IDLE_MS
        ? Number(process.env.PG_IDLE_MS)
        : 30000,
    });

    this.pool.on("error", (err: any) => {
      console.error("Unexpected Postgres client error", err);
    });
  }

  query = async <T>(text: string, params?: any[]): Promise<T[]> => {
    const result = await this.pool.query(text, params);
    return result.rows;
  };

  getPool = () => this.pool;

  closePool = async (): Promise<void> => {
    await this.pool.end();
  };
}
