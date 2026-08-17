import { defineConfig } from "tsup";
import pkg from "./package.json" with { type: "json" };

export default defineConfig([
  {
    entry: { "bin/imagesmith": "src/bin/imagesmith.ts" },
    format: ["esm"],
    target: "node20",
    clean: true,
    banner: { js: "#!/usr/bin/env node" },
    define: {
      __VERSION__: JSON.stringify(pkg.version),
    },
  },
  {
    entry: { index: "src/index.ts" },
    format: ["esm"],
    target: "node20",
    clean: false,
    dts: true,
  },
]);
