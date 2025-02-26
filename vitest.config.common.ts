import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  test: {
    alias: {
      '*': resolve(__dirname, './src'),
      '@': resolve(__dirname, './src'),
    },
  },
};
