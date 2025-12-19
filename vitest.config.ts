import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
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
          include: ['src/api/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'client',
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
