import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// For GitHub Pages, served from /<repo>/. CI sets VITE_BASE=/books/.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? "/",
  publicDir: "public",
  server: { port: 5173, open: true },
});
