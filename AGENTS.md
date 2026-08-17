# AGENTS.md — imagesmith-cli

---

## ⚡ Mandatory Session Start

Run these two lines before any commit, every session — no exceptions:

```bash
git config user.name "mahtamun-hoque-fahim"
git config user.email "mahtamunhoquefahim@gmail.com"
```

---

## Setup

```bash
git clone https://github.com/mahtamun-hoque-fahim/imagesmith-cli.git
cd imagesmith-cli

# Session start (always)
git config user.name "mahtamun-hoque-fahim"
git config user.email "mahtamunhoquefahim@gmail.com"

npm install
npm run build

# Test it works
node dist/bin/imagesmith.js --version
node dist/bin/imagesmith.js --help
```

---

## Project Conventions

- Language: TypeScript strict mode
- Output format: ESM only (`"type": "module"`)
- Node target: 20+
- Build: `tsup` — run `npm run build` after any src change
- `__VERSION__`: injected by tsup from package.json — never hardcode it
- Shebang is added by tsup banner — do NOT put `#!/usr/bin/env node` in source
- `src/mcp/` is a V3 stub — do not fill it, do not delete it
- All conversion logic lives in `src/core/` — CLI and MCP both call into it

## Import Style

```ts
// Always use .js extension in explicit imports (ESM):
import { convertToWebP } from "../core/convert.js";

// tsup resolves .ts → .js at build time
```

## Commit Style

```
feat: add recursive directory conversion
fix: handle empty directory gracefully
chore: bump to v0.2.0
```

---

## Session Log

### Session 1 — 2026-08-17
- Planned V2 (CLI) and V3 (MCP) roadmap
- Decided npm package name: `imagesmith`
- Separate repo from web app confirmed
- Phase 0 scaffold complete:
  - All source stubs created
  - BRAIN.md, PLANNER.md, AGENTS.md, README.md written
  - Build passes, `--version` and `--help` verified
- Phase 1 core engine complete:
  - `convertToWebP` — sharp WebP conversion, mkdir recursive, bytes delta
  - `walkDirectory` — Node 20 native recursive readdir, image filter, relative paths
  - `processZip` — adm-zip unpack → convert → repack, folder structure preserved
  - All three verified with live test: 688B PNG → 162B WebP (76% reduction)
