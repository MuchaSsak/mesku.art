import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { defineConfig } from "vite";

import site from "./plugins/site/index.ts";

export default defineConfig({
  // Unknown URLs get a 404 instead of falling back to index.html
  appType: "mpa",
  build: {
    rollupOptions: {
      input: {
        about: resolve(import.meta.dirname, "index.html"),
        gallery: resolve(import.meta.dirname, "moje-prace.html"),
        contact: resolve(import.meta.dirname, "kontakt.html"),
        notFound: resolve(import.meta.dirname, "404.html"),
      },
      output: {
        // The shared stylesheet would be named after a random chunk otherwise
        assetFileNames: ({ names }) =>
          names.some((name) => name.endsWith(".css"))
            ? "assets/style-[hash][extname]"
            : "assets/[name]-[hash][extname]",
        manualChunks: {
          splide: ["@splidejs/splide"],
        },
      },
    },
  },
  plugins: [tailwindcss(), site()],
});
