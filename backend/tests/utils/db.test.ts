import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Pool } from "pg";

const mockPoolInstance = {
  query: vi.fn(),
  end: vi.fn(),
  on: vi.fn(),
};

vi.mock("pg", () => ({
  Pool: vi.fn(
    class {
      constructor() {
        return mockPoolInstance;
      }
    },
  ),
}));

vi.mock("dotenv", () => ({
  default: {
    config: vi.fn(),
  },
}));

describe("db", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("should initialize pool with environment variables", async () => {
    process.env.DATABASE_URL = "postgresql://test";
    process.env.PGHOST = "localhost";
    process.env.PGUSER = "testuser";
    process.env.PGPASSWORD = "testpass";
    process.env.PGDATABASE = "testdb";
    process.env.PGPORT = "5432";
    process.env.PG_MAX = "20";
    process.env.PG_IDLE_MS = "60000";

    await import("../../src/utils/db");

    expect(Pool).toHaveBeenCalledWith({
      connectionString: "postgresql://test",
      host: "localhost",
      user: "testuser",
      password: "testpass",
      database: "testdb",
      port: 5432,
      max: 20,
      idleTimeoutMillis: 60000,
    });
  });

  it("should use default values when environment variables are not set", async () => {
    delete process.env.DATABASE_URL;
    delete process.env.PG_MAX;
    delete process.env.PG_IDLE_MS;
    delete process.env.PGPORT;

    await import("../../src/utils/db");

    expect(Pool).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionString: undefined,
        max: 10,
        idleTimeoutMillis: 30000,
        port: 5432,
      }),
    );
  });

  it("should register error handler on pool", async () => {
    await import("../../src/utils/db");

    expect(mockPoolInstance.on).toHaveBeenCalledWith(
      "error",
      expect.any(Function),
    );
  });

  it("should query the pool with text and params", async () => {
    const { query } = await import("../../src/utils/db");
    const mockResult = { rows: [{ id: 1 }], rowCount: 1 };
    mockPoolInstance.query.mockResolvedValue(mockResult);

    const result = await query("SELECT * FROM users WHERE id = $1", [1]);

    expect(mockPoolInstance.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = $1",
      [1],
    );
    expect(result).toEqual(mockResult);
  });

  it("should query the pool without params", async () => {
    const { query } = await import("../../src/utils/db");
    const mockResult = { rows: [], rowCount: 0 };
    mockPoolInstance.query.mockResolvedValue(mockResult);

    const result = await query("SELECT * FROM users");

    expect(mockPoolInstance.query).toHaveBeenCalledWith(
      "SELECT * FROM users",
      undefined,
    );
    expect(result).toEqual(mockResult);
  });

  it("should return the pool instance from getPool", async () => {
    const { getPool, default: pool } = await import("../../src/utils/db");

    const returnedPool = getPool();

    expect(returnedPool).toBe(pool);
  });

  it("should close the pool when closePool is called", async () => {
    const { closePool } = await import("../../src/utils/db");
    mockPoolInstance.end.mockResolvedValue(undefined);

    await closePool();

    expect(mockPoolInstance.end).toHaveBeenCalledOnce();
  });

  it("should log error when pool emits error event", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    await import("../../src/utils/db");

    const errorHandler = mockPoolInstance.on.mock.calls.find(
      (call: any) => call[0] === "error",
    )?.[1];
    const testError = new Error("Connection lost");

    errorHandler(testError);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Unexpected Postgres client error",
      testError,
    );

    consoleErrorSpy.mockRestore();
  });
});
