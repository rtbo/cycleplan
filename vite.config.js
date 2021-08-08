import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import purgeIcons from "vite-plugin-purge-icons";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    purgeIcons({ content: ["index.html", "src/**/*.ts", "src/**/*.vue"] }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
  },
});
