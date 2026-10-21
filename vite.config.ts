import { defineConfig } from 'vite';

export default defineConfig({
  // Relative paths so the build works under https://<user>.github.io/vinder/
  base: './',
  server: {
    host: true,
  },
  build: {
    // Phaser alone is ~1.2 MB; that's expected, not a problem.
    chunkSizeWarningLimit: 1500,
  },
});
