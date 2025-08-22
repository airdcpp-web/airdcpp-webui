import { defineConfig, mergeConfig } from 'vitest/config';

import CommonConfig from './vitest.config.common';

export default mergeConfig(
  CommonConfig,
  defineConfig({
    test: {
      include: ['**/*.browser.{test,spec}.?(c|m)[jt]s?(x)'],
      setupFiles: ['./vitest/setup.common.ts'],
      environment: 'jsdom',
      browser: {
        enabled: true,
        provider: 'playwright',
        instances: [{ browser: 'chromium' }],
        viewport: { width: 1200, height: 600 },
      },
    },
  }),
);
