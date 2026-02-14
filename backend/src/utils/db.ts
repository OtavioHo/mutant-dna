import { Pool, QueryResult, QueryResultRow } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
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

pool.on("error", (err: any) => {
  console.error("Unexpected Postgres client error", err);
});

export async function query<T extends QueryResultRow>(
  text: string,
  params?: any[],
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export function getPool(): Pool {
  return pool;
}

export async function closePool(): Promise<void> {
  await pool.end();
}

export default pool;
