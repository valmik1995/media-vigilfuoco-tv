import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Risolve il problema "resolveDispatcher is null" (Hook duplicati)
    dedupe: ["react", "react-dom"],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    // ⬇️ SOLUZIONE PER IL BLOCKED REQUEST ⬇️
    allowedHosts: ["media-vigilfuoco.ddev.site"],
    hmr: {
      host: "media-vigilfuoco.ddev.site",
      protocol: "wss",
    },
    watch: {
      usePolling: true,
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@tanstack/react-query"],
  },
});
