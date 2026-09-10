import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      { extends: './vitest.config.browser.mts' },
      { extends: './vitest.config.node.mts' },
    ],
    coverage: {
      exclude: ['**/resources/locales/**'],
    },
  },
});