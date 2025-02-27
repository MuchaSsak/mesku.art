import tailwindcss from "@tailwindcss/vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        about: resolve(__dirname, "index.html"),
        gallery: resolve(__dirname, "moje-prace.html"),
        contact: resolve(__dirname, "kontakt.html"),
      },
    },
  },
  plugins: [tailwindcss()],
});
