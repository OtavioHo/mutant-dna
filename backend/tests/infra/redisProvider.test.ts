import { describe, it, expect, vi, afterEach } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  delete process.env.REDIS_URL;
});

describe("RedisCacheProvider", () => {
  it("uses redis client methods when client is healthy", async () => {
    const clientMock = {
      on: vi.fn(),
      connect: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue("my-val"),
      setEx: vi.fn().mockResolvedValue("OK"),
      set: vi.fn().mockResolvedValue("OK"),
      del: vi.fn().mockResolvedValue(1),
    };
    vi.doMock("redis", () => ({ createClient: () => clientMock }));
    const { RedisCacheProvider } =
      await import("../../src/infra/cache/redisProvider");
    const provider = new RedisCacheProvider();
    await new Promise((r) => setImmediate(r));

    await provider.set("k", "v", 10);
    expect(clientMock.setEx).toHaveBeenCalledWith("k", 10, "v");

    await provider.set("k2", "v2");
    expect(clientMock.set).toHaveBeenCalledWith("k2", "v2");

    const val = await provider.get("k");
    expect(clientMock.get).toHaveBeenCalledWith("k");
    expect(val).toBe("my-val");

    await provider.del("k");
    expect(clientMock.del).toHaveBeenCalledWith("k");
  });

  it("falls back to noop client when createClient throws", async () => {
    vi.doMock("redis", () => ({
      createClient: () => {
        throw new Error("create fail");
      },
    }));
    const { RedisCacheProvider } =
      await import("../../src/infra/cache/redisProvider");
    const provider = new RedisCacheProvider();

    const val = await provider.get("any");
    expect(val).toBeNull();

    await expect(provider.set("a", "b")).resolves.toBeUndefined();
    await expect(provider.set("a", "b", 10)).resolves.toBeUndefined();
    await expect(provider.del("a")).resolves.toBeUndefined();
  });

  it("falls back to noop client when connect rejects", async () => {
    const clientMock = {
      on: vi.fn(),
      connect: vi.fn().mockRejectedValue(new Error("no connect")),
      get: vi.fn().mockResolvedValue("still"),
      setEx: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
    };
    vi.doMock("redis", () => ({ createClient: () => clientMock }));
    const { RedisCacheProvider } =
      await import("../../src/infra/cache/redisProvider");
    const provider = new RedisCacheProvider();
    await new Promise((r) => setImmediate(r));

    const val = await provider.get("k");
    expect(val).toBeNull();
  });

  it("falls back to noop client when client emits an error", async () => {
    let errHandler: ((e: any) => void) | undefined;
    const clientMock = {
      on: vi.fn((evt: string, cb: any) => {
        if (evt === "error") errHandler = cb;
      }),
      connect: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue("val"),
      setEx: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
    };
    vi.doMock("redis", () => ({ createClient: () => clientMock }));
    const { RedisCacheProvider } =
      await import("../../src/infra/cache/redisProvider");
    const provider = new RedisCacheProvider();
    await new Promise((r) => setImmediate(r));

    // simulate error event
    errHandler && errHandler(new Error("boom"));
    await new Promise((r) => setImmediate(r));

    const val = await provider.get("k");
    expect(val).toBeNull();
  });
});
