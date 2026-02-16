import { describe, it, expect, vi, beforeEach } from "vitest";
import { FastifyInstance } from "fastify";
import { mutantRoutes } from "../../../src/mutants/routes/index";
import buildContainer from "../../../src/mutants/container";

vi.mock("../../../src/mutants/container");

describe("mutantRoutes", () => {
  let mockApp: FastifyInstance;
  let mockContainer: any;
  let mockCheckMutant: any;
  let mockDatabaseProvider: any;
  let mockCacheProvider: any;

  beforeEach(() => {
    mockCheckMutant = vi.fn();
    mockContainer = {
      mutantsController: {
        checkMutant: mockCheckMutant,
      },
    };
    mockDatabaseProvider = {} as any;
    mockCacheProvider = {} as any;

    mockApp = {
      decorate: vi.fn(),
      post: vi.fn(),
    } as any;

    vi.mocked(buildContainer).mockReturnValue(mockContainer);
  });

  it("should build the container", () => {
    mutantRoutes(mockApp, mockDatabaseProvider, mockCacheProvider);

    expect(buildContainer).toHaveBeenCalledOnce();
  });

  it("should decorate the app with mutantContainer", () => {
    mutantRoutes(mockApp, mockDatabaseProvider, mockCacheProvider);

    expect(mockApp.decorate).toHaveBeenCalledWith(
      "mutantContainer",
      mockContainer,
    );
  });

  it("should register POST / route with checkMutant handler", () => {
    mutantRoutes(mockApp, mockDatabaseProvider, mockCacheProvider);

    expect(mockApp.post).toHaveBeenCalledWith("/", {
      handler: mockCheckMutant,
      schema: {
        body: {
          properties: {
            dna: {
              items: {
                type: "string",
              },
              type: "array",
            },
          },
          required: ["dna"],
          type: "object",
        },
      },
    });
  });
});
