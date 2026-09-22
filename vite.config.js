import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: false, // Prevents passing deprecated esbuild options to the Vite 8 bundler
});