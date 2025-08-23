import { defineConfig, mergeConfig } from 'vitest/config';

import CommonConfig from './vitest.config.common';

export default mergeConfig(
  CommonConfig,
  defineConfig({
    test: {
      include: ['**/*.node.{test,spec}.?(c|m)[jt]s?(x)'],
      setupFiles: ['./vitest/setup.node.ts'],
      environment: 'jsdom',
      name: 'Node',
    },
  }),
);
