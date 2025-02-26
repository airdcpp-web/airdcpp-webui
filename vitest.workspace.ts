import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // If you want to keep running your existing tests in Node.js, uncomment the next line.
  // 'vitest.config.ts',
  {
    extends: 'vitest.config.browser.ts',
    test: {
      include: ['**/*.browser.{test,spec}.?(c|m)[jt]s?(x)'],
      // poolOptions: { threads: { singleThread: true } },
      browser: {
        enabled: true,
        provider: 'playwright',
        // https://vitest.dev/guide/browser/playwright
        instances: [{ browser: 'chromium' }],
        // viewport: { width: 1920, height: 1080 },
      },
    },
  },
  {
    extends: 'vitest.config.node.ts',
    test: {
      include: ['**/*.node.{test,spec}.?(c|m)[jt]s?(x)'],
      name: 'node',
      environment: 'jsdom',
      // poolOptions: { threads: { singleThread: true } },
    },
  },
]);
