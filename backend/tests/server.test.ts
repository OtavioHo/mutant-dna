import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock at the top level, before any imports that might use it
const mockListen = vi.fn();
const mockInfo = vi.fn();
const mockError = vi.fn();
const mockApp = {
  listen: mockListen,
  log: { info: mockInfo, error: mockError },
};

vi.mock("../src/app.js", () => ({ buildApp: () => mockApp }));

describe("start server", () => {
  const SERVER_PATH = "../src/server";
  let originalEnv: NodeJS.ProcessEnv;
  let exitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks(); // Clear mock call history
    originalEnv = { ...process.env };
    exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    process.env = originalEnv;
    exitSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it("should call app.listen with env port/host and log info on success", async () => {
    process.env.PORT = "4000";
    process.env.HOST = "127.0.0.1";

    mockListen.mockResolvedValueOnce(undefined);

    const { default: start } = await import(SERVER_PATH);
    await start();

    expect(mockListen).toHaveBeenCalledTimes(2);
    expect(mockListen).toHaveBeenCalledWith({ port: 4000, host: "127.0.0.1" });
    expect(mockInfo).toHaveBeenCalledTimes(2);
    expect((mockInfo as any).mock.calls[0][0]).toContain(
      "http://127.0.0.1:4000",
    );
    expect(process.exit).not.toHaveBeenCalled();
  });

  it("should log error and call process.exit(1) when listen rejects", async () => {
    delete process.env.PORT;
    delete process.env.HOST;

    const error = new Error("Listen failed");
    mockListen.mockRejectedValueOnce(error);

    const { default: start } = await import(SERVER_PATH);
    await start();

    expect(mockListen).toHaveBeenCalledTimes(2);
    expect(mockError).toHaveBeenCalledWith(error);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
