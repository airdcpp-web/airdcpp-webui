import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      { extends: './vitest.config.browser.ts' },
      { extends: './vitest.config.node.ts' },
    ],
  },
});
