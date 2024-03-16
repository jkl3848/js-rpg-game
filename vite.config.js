import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ReactivityTransform from "@vue-macros/reactivity-transform/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue(), ReactivityTransform()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
