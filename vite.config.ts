import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// For GitHub Pages, served from /<repo>/. CI sets VITE_BASE=/books/ explicitly.
// Default also /books/ so local `npm run build` outputs match the build-time
// scripts (_essays.ts uses the same default for SITE_BASE).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? "/books/",
  publicDir: "public",
  server: { port: 5173, open: true },
});
