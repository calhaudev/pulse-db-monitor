import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts"],
  outDir: "dist",
  target: "node18",
  format: ["cjs"],
  clean: true,
  dts: true,
  sourcemap: true,
  skipNodeModulesBundle: true,
});
