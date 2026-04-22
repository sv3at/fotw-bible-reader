/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
  server: { open: true },
  test: {
    environment: "node",
    include: ["tests/**/*.test.mjs"],
  },
});
