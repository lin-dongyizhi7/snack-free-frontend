import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/snack-free-frontend/" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [vue()],
  define: {
    "process.env.TARGET_FOLDER": JSON.stringify(
      process.env.NODE_ENV === "production"
        ? "real/"
        : "test/"
    ),
  },
});
