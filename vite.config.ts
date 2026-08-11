import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const configuredBase = process.env.BASE_PATH || '/olive-stack-site/';
const base = `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
