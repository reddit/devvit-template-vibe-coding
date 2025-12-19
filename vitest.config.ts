import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    // Needed due to the custom conditions within devvit web
    typecheck: {
      enabled: false,
    },
    reporters: ['dot'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text-summary', 'html'],
    },
    projects: [
      {
        test: {
          name: 'server',
          include: ['src/server/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'client',
          include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
          exclude: ['src/server/**/*'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
