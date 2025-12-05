import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Setting base to './' ensures that generated asset links are relative.
  // This makes the app compatible with all hosting environments, including 
  // those that serve the app from a subdirectory (like GitHub Pages).
  base: './',
  build: {
    outDir: 'dist',
  }
});