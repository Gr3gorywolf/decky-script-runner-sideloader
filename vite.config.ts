import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/decky-script-runner-sideloader/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
