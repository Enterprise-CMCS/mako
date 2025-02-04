import { cpus } from "os";
import { join } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environmentMatchGlobs: [["**/*.test.ts", "**/*.test.tsx"]],
    cache: {
      dir: ".vitest/cache",
    },
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
        maxThreads: Math.max(1, Math.floor(cpus().length * 0.75)),
        minThreads: Math.max(1, Math.floor(cpus().length * 0.5)),
      },
    },
    coverage: {
      provider: "istanbul",
      reportsDirectory: join(__dirname, "coverage"),
      reporter: ["html", "text", "json-summary", "json", "lcovonly"],
      thresholds: {
        lines: 90,
        branches: 80,
        functions: 85,
        statements: 90,
      },
      reportOnFailure: true,
      exclude: [
        ...configDefaults.exclude,
        ".build_run",
        "build_run",
        ".cdk",
        "bin/app.ts",
        "bin/cli/**",
        "docs/**",
        "lib/libs/email/mock-data/**",
        "lib/libs/webforms/**",
        "lib/local-aspects",
        "lib/local-constructs/**",
        "lib/packages/eslint-config-custom/**",
        "lib/packages/eslint-config-custom-server/**",
        "lib/stacks/**",
        "mocks/**",
        "node_modules/**",
        "**/node_modules/**",
        "react-app/src/components/ScrollToTop/**",
        "react-app/src/features/webforms/**",
        "react-app/src/main.tsx",
        "react-app/src/utils/test-helpers/**",
        "test/e2e/**",
        "vitest.workspace.ts",
        "**/*/.eslintrc.{ts,js,cjs}",
        "**/*.config.{ts,js,cjs}",
        "**/*.js",
        "**/*.css",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/assets/**",
        "**/coverage/**",
        "**/vitest.setup.ts",
      ],
    },
  },
});
