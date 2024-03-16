import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import ReactivityTransform from "@vue-macros/reactivity-transform/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [Vue(), ReactivityTransform()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
