import { vi, describe, it, expect, beforeEach } from "vitest";
import { PostgresProvider } from "../../src/infra/database/postgresProvider";
import { Pool as MockedPoolModule } from "pg";

vi.mock("pg", () => {
  // Minimal Mock Pool capturing constructor options and behavior
  const mock = {
    lastCreatedPool: undefined as any,
  };

  class Pool {
    options: any;
    query = vi.fn(async (text: string, params?: any[]) => ({
      rows: [{ text, params }],
    }));
    end = vi.fn(async () => {});
    on = vi.fn();

    constructor(opts: any) {
      this.options = opts;
      mock.lastCreatedPool = this;
    }
  }

  return { Pool, __esModule: true, __mock__: mock };
});

describe("PostgresProvider", () => {
  beforeEach(() => {
    // Clear env vars used by provider
    delete process.env.DATABASE_URL;
    delete process.env.PGHOST;
    delete process.env.PGUSER;
    delete process.env.PGPASSWORD;
    delete process.env.PGDATABASE;
    delete process.env.PGPORT;
    delete process.env.PG_MAX;
    delete process.env.PG_IDLE_MS;
    vi.clearAllMocks();
  });

  it("initializes Pool with env options (defaults applied)", () => {
    process.env.PGHOST = "localhost";
    process.env.PGUSER = "user";
    process.env.PGPASSWORD = "pass";
    process.env.PGDATABASE = "db";
    process.env.PGPORT = "5433";
    process.env.PG_MAX = "20";
    process.env.PG_IDLE_MS = "15000";

    const provider = new PostgresProvider();
    const pool = provider.getPool() as any;

    expect(pool.options.host).toBe("localhost");
    expect(pool.options.user).toBe("user");
    expect(pool.options.password).toBe("pass");
    expect(pool.options.database).toBe("db");
    expect(pool.options.port).toBe(5433);
    expect(pool.options.max).toBe(20);
    expect(pool.options.idleTimeoutMillis).toBe(15000);
  });

  it("uses DATABASE_URL when provided", () => {
    process.env.DATABASE_URL = "postgres://me:pw@db:5432/maindb";

    const provider = new PostgresProvider();
    const pool = provider.getPool() as any;

    expect(pool.options.connectionString).toBe(
      "postgres://me:pw@db:5432/maindb",
    );
  });

  it("query returns rows and forwards params", async () => {
    const provider = new PostgresProvider();
    const sql = "SELECT * FROM table WHERE id = $1";
    const params = [42];

    const res = await provider.query<{ text: string; params?: any[] }>(
      sql,
      params,
    );

    // Our mock returns rows: [{ text, params }]
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].text).toBe(sql);
    expect(res[0].params).toEqual(params);

    const pool = provider.getPool() as any;
    expect(pool.query).toHaveBeenCalledWith(sql, params);
  });

  it("registers error handler and closePool calls end", async () => {
    const provider = new PostgresProvider();
    const pool = provider.getPool() as any;

    expect(pool.on).toHaveBeenCalledWith("error", expect.any(Function));

    await provider.closePool();
    expect(pool.end).toHaveBeenCalled();
  });

  it("handles error event on pool", () => {
    const provider = new PostgresProvider();
    const pool = provider.getPool() as any;
    const errorHandler = pool.on.mock.calls.find(
      (call: any) => call[0] === "error",
    )[1];

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const testError = new Error("Test pool error");
    errorHandler(testError);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Unexpected Postgres client error",
      testError,
    );

    consoleErrorSpy.mockRestore();
  });
});
