import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "~": "/src",
      "~pages":"/src/pages",
      "~libs": "/src/libs",
      "~assets": "/src/assets",
      "~components": "/src/libs/components",
      "~hooks": "/src/libs/hooks",
      "~utils": "/src/libs/utils",
      "~api": "/src/libs/api",
      "~context": "/src/libs/context",
    },
  },
});
