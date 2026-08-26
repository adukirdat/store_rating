import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  if (!env.VITE_API_BASE_URL?.trim()) {
    throw new Error('VITE_API_BASE_URL must be configured before starting or building the frontend.');
  }

  return {
    plugins: [react(), tailwindcss()],
  };
});
