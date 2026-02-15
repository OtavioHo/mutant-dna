import { describe, it, expect, vi, beforeEach } from "vitest";
import { statsRoutes } from "../../../src/stats/routes";
import { buildContainer } from "../../../src/stats/container";
import { FastifyInstance } from "fastify";

vi.mock("../../../src/stats/container");

describe("stats/routes/index", () => {
  let mockApp: FastifyInstance;
  let mockContainer: any;
  let mockGetStats: any;

  beforeEach(() => {
    mockGetStats = vi.fn();
    mockContainer = {
      statsController: {
        getStats: mockGetStats,
      },
    };

    mockApp = {
      decorate: vi.fn(),
      get: vi.fn(),
    } as any;

    vi.mocked(buildContainer).mockReturnValue(mockContainer);
  });

  it("builds container and decorates Fastify instance", () => {
    statsRoutes(mockApp);

    expect(buildContainer).toHaveBeenCalled();
    expect(mockApp.decorate).toHaveBeenCalledWith(
      "statsContainer",
      mockContainer,
    );
  });
});
