import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir:
      process.env.IS_PROD === "true"
        ? "../web/public/webble-chatbox"
        : "../web/public/webble-chatbox-dev",
    rollupOptions: {
      input: {
        index: "./src/webble.ts",
      },
      output: {
        entryFileNames: `[name].js`, // works
        chunkFileNames: `[name].js`, // works
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
  ],
});
