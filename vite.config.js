import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "./",
    plugins: [react(), tailwindcss()],
    resolve: {
        tsconfigPaths: true,
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
    },
    server: {
        port: 5173,
        strictPort: true,
    },
});
