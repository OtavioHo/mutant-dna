import { describe, it, expect } from "vitest";
import { buildApp } from "../src/app";

describe("GET /hello", () => {
  it("returns hello message", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/hello" });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty("message");
  });
});
