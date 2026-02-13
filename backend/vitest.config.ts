import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8", // or 'c8' if you prefer
      reporter: ["text", "html"],
      include: ["src/**/*.ts"], // files to include in report
      exclude: [
        "tests/**",
        "node_modules/**",
        "**/*.test.ts",
        "**/*.interface.ts",
      ], // files to exclude from report
    },
  },
});
