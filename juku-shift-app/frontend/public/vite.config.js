import os from "node:os";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = path.resolve(__dirname, "..");
const cacheDir = path.join(os.tmpdir(), "vite-juku-shift-cache");

export default defineConfig({
  root, // point to frontend/ so /src を解決できるようにする
  envDir: root, // .env は root 直下を見る
  cacheDir, // write cache to temp dir to avoid OneDrive ACL issues
  plugins: [react()],
  resolve: {
    alias: {
      "vite/dist/client/env.mjs": "@vite/env" // ensure transformed env is used
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, "")
      }
    }
  }
});
