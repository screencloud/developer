import { defineConfig } from "vite";

export default defineConfig({
  // Relative asset URLs, so the built app works when hosted under any subpath.
  base: "./",
  build: {
    // Older signage-device webviews; matches the broad browserslist target.
    target: "es2015",
  },
  server: {
    port: 8000,
  },
});
