// vite.config.ts
import { defineConfig } from "file:///Users/gimeldick/Desktop/Projects/Personal/webble-forms/node_modules/.pnpm/vite@5.2.11_@types+node@20.11.24_sugarss@4.0.1/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///Users/gimeldick/Desktop/Projects/Personal/webble-forms/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@3.1.0_svelte@4.2.17_vite@5.2.11_@types+node@20.11.24_sugarss@4.0.1_postcss@8.4.38__/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
var vite_config_default = defineConfig({
  build: {
    outDir: process.env.NODE_ENV === "production" ? "../web/public/webble-chatbox" : "../web/public/webble-chatbox-dev",
    rollupOptions: {
      input: {
        index: "./src/webble.ts"
      },
      output: {
        entryFileNames: `[name].js`,
        // works
        chunkFileNames: `[name].js`,
        // works
        assetFileNames: `[name].[ext]`
      }
    }
  },
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ2ltZWxkaWNrL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvd2ViYmxlLWZvcm1zL2FwcHMvcmVuZGVyZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9naW1lbGRpY2svRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC93ZWJibGUtZm9ybXMvYXBwcy9yZW5kZXJlci92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZ2ltZWxkaWNrL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvd2ViYmxlLWZvcm1zL2FwcHMvcmVuZGVyZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSBcIkBzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGVcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOlxuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiXG4gICAgICAgID8gXCIuLi93ZWIvcHVibGljL3dlYmJsZS1jaGF0Ym94XCJcbiAgICAgICAgOiBcIi4uL3dlYi9wdWJsaWMvd2ViYmxlLWNoYXRib3gtZGV2XCIsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgaW5kZXg6IFwiLi9zcmMvd2ViYmxlLnRzXCIsXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBgW25hbWVdLmpzYCwgLy8gd29ya3NcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGBbbmFtZV0uanNgLCAvLyB3b3Jrc1xuICAgICAgICBhc3NldEZpbGVOYW1lczogYFtuYW1lXS5bZXh0XWAsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBzdmVsdGUoe1xuICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgIGN1c3RvbUVsZW1lbnQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlZLFNBQVMsb0JBQW9CO0FBQzlaLFNBQVMsY0FBYztBQUd2QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxRQUNFLFFBQVEsSUFBSSxhQUFhLGVBQ3JCLGlDQUNBO0FBQUEsSUFDTixlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxPQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUE7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQTtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLGlCQUFpQjtBQUFBLFFBQ2YsZUFBZTtBQUFBLE1BQ2pCO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
