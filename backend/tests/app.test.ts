import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { FastifyInstance } from "fastify";
import { buildApp } from "../src/app";

describe("buildApp", () => {
  let app: FastifyInstance;

  beforeEach(() => {
    app = buildApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("should create a Fastify instance", () => {
    expect(app).toBeDefined();
    expect(app.server).toBeDefined();
  });

  it("should return welcome message on GET /", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: "Welcome to the Mutant Detection API",
    });
  });

  it("should register mutant routes with /mutants prefix", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/mutants",
    });

    // Should not return 404, meaning the route is registered
    expect(response.statusCode).not.toBe(404);
  });
});
