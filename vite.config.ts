import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { resolve } from "path";
import { defineConfig } from "vite";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    https: {
      key: "./localhost-key.pem",
      cert: "./localhost.pem",
    },
  },
  define: {
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
