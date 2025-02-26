import { defineConfig, mergeConfig } from 'vitest/config';

import CommonConfig from './vitest.config.common';

export default mergeConfig(
  CommonConfig,
  defineConfig({
    test: {
      setupFiles: ['./vitest/setup.common.ts'],
      environment: 'jsdom',
    },
  }),
);
