// vite.config.ts
import { defineConfig } from "file:///Users/gimeldick/Desktop/Projects/Personal/webble-forms/node_modules/.pnpm/vite@5.2.11_@types+node@20.11.24_sugarss@4.0.1_postcss@8.4.38_/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///Users/gimeldick/Desktop/Projects/Personal/webble-forms/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@3.1.0_svelte@4.2.17_vite@5.2.11_@types+node@20.11.24_sugarss@4.0.1_postcss@8.4.38__/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
var vite_config_default = defineConfig({
  build: {
    outDir: "../web/public/webble-chatbox",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ2ltZWxkaWNrL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvd2ViYmxlLWZvcm1zL2FwcHMvcmVuZGVyZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9naW1lbGRpY2svRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC93ZWJibGUtZm9ybXMvYXBwcy9yZW5kZXJlci92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZ2ltZWxkaWNrL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvd2ViYmxlLWZvcm1zL2FwcHMvcmVuZGVyZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSBcIkBzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGVcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBcIi4uL3dlYi9wdWJsaWMvd2ViYmxlLWNoYXRib3hcIixcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBpbmRleDogXCIuL3NyYy93ZWJibGUudHNcIixcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IGBbbmFtZV0uanNgLCAvLyB3b3Jrc1xuICAgICAgICBjaHVua0ZpbGVOYW1lczogYFtuYW1lXS5qc2AsIC8vIHdvcmtzXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiBgW25hbWVdLltleHRdYCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHN2ZWx0ZSh7XG4gICAgICBjb21waWxlck9wdGlvbnM6IHtcbiAgICAgICAgY3VzdG9tRWxlbWVudDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVksU0FBUyxvQkFBb0I7QUFDOVosU0FBUyxjQUFjO0FBR3ZCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE9BQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQTtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsaUJBQWlCO0FBQUEsUUFDZixlQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
