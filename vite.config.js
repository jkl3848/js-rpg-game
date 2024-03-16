import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueMacros from "unplugin-vue-macros/vite";
import ReactivityTransform from "@vue-macros/reactivity-transform/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
      },
    }),
    ReactivityTransform(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
