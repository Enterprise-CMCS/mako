import { configDefaults, defineWorkspace } from "vitest/config";
import path from "path";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = Infinity;

export default defineWorkspace([
  {
    test: {
      name: "libs",
      include: ["lib/**/*.test.{ts,tsx}"],
      exclude: [
        ...configDefaults.exclude,
        "lib/libs/webforms/**",
        "lib/libs/email/**",
        "lib/local-constructs/**",
      ],
      environment: "node",
      coverage: {
        reporter: ["text", "json-summary", "html"], // Make sure 'json-summary' is included
        reportsDirectory: "./coverage",
      },
      globals: true,
      setupFiles: ["./lib/vitest.setup.ts"],
      pool: "threads",
      alias: {
        // Add path aliases to match your imports
        lib: path.resolve(__dirname, "./lib"),
        libs: path.resolve(__dirname, "./lib/libs"),
      },
      poolOptions: {
        threads: {
          singleThread: false,
        },
      },
    },
  },
  {
    test: {
      name: "react-app",
      include: ["./react-app/src/**/*.test.tsx", "react-app/src/**/*.test.ts"],
      exclude: ["./react-app/src/features/**"],
      environment: "jsdom",
      coverage: {
        reporter: ["text", "json-summary", "html"],
        reportsDirectory: "./coverage",
      },
      globals: true,
      setupFiles: ["./react-app/vitest.setup.ts"],
      pool: "threads",
      poolOptions: {
        threads: {
          singleThread: false,
        },
      },
      alias: {
        "@": path.resolve(__dirname, "./react-app/src"),
      },
    },
  },
  {
    test: {
      name: "emails",
      include: ["lib/libs/email/**/*.test.tsx", "lib/libs/email/**/*.test.ts"],
      environment: "jsdom",
      coverage: {
        reporter: ["text", "json-summary", "html"],
        reportsDirectory: "./coverage",
      },
      setupFiles: ["lib/libs/email/vitest.setup.ts"],
      globals: true,
      pool: "threads",
      poolOptions: {
        threads: {
          singleThread: false,
        },
      },
    },
  },
]);
