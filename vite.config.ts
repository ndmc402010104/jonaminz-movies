import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base 對應 GitHub Pages 的 project site 子路徑
// （https://ndmc402010104.github.io/jonaminz-movies/），資源路徑都要帶這個
// 前綴，否則部署後 404。
export default defineConfig({
  base: "/jonaminz-movies/",
  plugins: [react(), tailwindcss()],
});
