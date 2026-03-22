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
  // Allow importing .md files as raw strings (used by cheatsheets glob)
  assetsInclude: ["**/*.md"],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Cheatsheets feature — only loaded when that tab is visited
          "feature-cheatsheets-md": [
            "react-markdown",
            "remark-gfm",
            "rehype-highlight",
            "rehype-slug",
          ],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },
});
