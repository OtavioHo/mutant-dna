import { describe, it, expect, vi, beforeEach } from "vitest";
import { FastifyInstance } from "fastify";
import routes from "../../../src/mutants/routes/index";
import buildContainer from "../../../src/mutants/container";

vi.mock("../../../src/mutants/container");

describe("routes", () => {
  let mockApp: FastifyInstance;
  let mockContainer: any;
  let mockCheckMutant: any;

  beforeEach(() => {
    mockCheckMutant = vi.fn();
    mockContainer = {
      mutantsController: {
        checkMutant: mockCheckMutant,
      },
    };

    mockApp = {
      decorate: vi.fn(),
      get: vi.fn(),
    } as any;

    vi.mocked(buildContainer).mockReturnValue(mockContainer);
  });

  it("should build the container", () => {
    routes(mockApp);

    expect(buildContainer).toHaveBeenCalledOnce();
  });

  it("should decorate the app with mutantContainer", () => {
    routes(mockApp);

    expect(mockApp.decorate).toHaveBeenCalledWith(
      "mutantContainer",
      mockContainer,
    );
  });

  it("should register GET / route with checkMutant handler", () => {
    routes(mockApp);

    expect(mockApp.get).toHaveBeenCalledWith("/", mockCheckMutant);
  });
});
