import { resolve } from 'path';

export default {
  test: {
    alias: {
      '*': resolve(__dirname, './src'),
      '@': resolve(__dirname, './src'),
    },
  },
};
