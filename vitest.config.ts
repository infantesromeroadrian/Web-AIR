import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root,
  test: {
    root,
    include: ["tests/**/*.test.ts"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.vercel/**",
      "**/.astro/**",
      "**/.claude/**",
      "**/worktrees/**",
    ],
    environment: "node",
  },
});
