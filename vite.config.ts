import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";

function logServerInfo(): Plugin {
  return {
    name: "log-server-info",
    configureServer(server: ViteDevServer) {
      server.httpServer?.once("listening", () => {
        const address = server.httpServer?.address();
        const port = typeof address === "object" ? address?.port : address;

        console.log("");
        console.log("Dev server connection info:");
        console.log(`  Local:   http://localhost:${port}`);
        console.log("");
      });
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), logServerInfo()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    // host: true,
    port: 5173,
    strictPort: false, // allow fallback ports
    open: true,
  },
});