import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      './vitest.config.browser.mts',
      './vitest.config.node.mts',
    ],
    coverage: {
      exclude: ['**/resources/locales/**'],
    },
  },
});