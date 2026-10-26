import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// Builds with VITE_COURSES_URL download courses from the website instead of bundling them.
const remote = !!process.env.VITE_COURSES_URL?.trim();
const devKeyFile = path.resolve(__dirname, "dist-courses/dev-public-key.txt");

// `npm run dev:remote`: serve dist-courses/ at /courses-dev/ like the website would.
const devCourses = (): Plugin => ({
  name: "dev-courses",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use("/courses-dev", (req, res, next) => {
      const file = path.join(__dirname, "dist-courses", decodeURIComponent((req.url ?? "/").split("?")[0]));
      if (!file.startsWith(path.join(__dirname, "dist-courses")) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return next();
      res.setHeader("Content-Type", file.endsWith(".json") ? "application/json" : "text/plain");
      fs.createReadStream(file).pipe(res);
    });
  },
});

// Tauri expects a fixed port and no screen clearing in dev.
export default defineConfig(({ command }) => ({
  plugins: [react(), devCourses()],
  define: {
    __DEV_COURSE_KEY__: JSON.stringify(command === "serve" && fs.existsSync(devKeyFile) ? fs.readFileSync(devKeyFile, "utf8").trim() : ""),
  },
  resolve: {
    alias: remote ? [{ find: "./bundledCourses", replacement: path.resolve(__dirname, "src/lib/bundledCourses.remote.ts") }] : [],
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  envPrefix: ["VITE_", "TAURI_ENV_"],
  // Code exercise workers are module workers (the Python one imports Pyodide's ES module).
  worker: { format: "es" },
  build: {
    target: "es2021",
    outDir: "dist",
  },
}));
