import { defineConfig, configDefaults } from "vitest/config";
import { join } from "path";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      reportsDirectory: join(__dirname, "coverage"),
      reporter: ["html", "text", "json-summary", "json", "lcovonly"],
      reportOnFailure: true,
      exclude: [
        ...configDefaults.exclude,
        ".build_run",
        "build_run",
        ".cdk",
        "docs",
        "lib/libs/webforms",
        "react-app/src/features/webforms",
        "TestWrapper.tsx",
        "lib/stacks",
        "lib/packages/eslint-config-custom",
        "lib/packages/eslint-config-custom-server",
        "lib/local-aspects",
        "lib/local-constructs",
        "lib/libs/email/content",
        "bin/cli",
        "bin/app.ts",
        "vitest.workspace.ts",
        "**/*/.eslintrc.{ts,js,cjs}",
        "**/*.config.{ts,js,cjs}",
        "lib/lambda/package-actions/services/seatool-write-service.ts",
        "**/coverage",
        "test/**",
        "**/*.js",
      ],
    },
  },
});
