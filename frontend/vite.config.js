import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // 1. Importa path per gestire i percorsi
import { fileURLToPath } from "url"; // Necessario per definire __dirname in ESM

// 2. Definiamo __dirname manualmente (perché in ES Modules non esiste di default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    // 3. Aggiungi gli alias qui
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@types": path.resolve(__dirname, "./src/types/index.ts"),
    },
    // Mantieni il tuo dedupe esistente
    dedupe: ["react", "react-dom"],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
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
