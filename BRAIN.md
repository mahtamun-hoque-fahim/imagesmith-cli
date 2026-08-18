# BRAIN.md — imagesmith-cli

> Source of truth for this project. When Claude drifts or loses context — fetch this.
> Run `fetch brain` to reload BRAIN + PLANNER + AGENTS together.

---

## The One-Line Truth

imagesmith-cli is the developer-facing companion to ImageSmith (the web app) — a Node.js CLI that converts any image or folder of images to WebP using sharp, preserving folder structure in the output.

---

## Why It Exists

ImageSmith V1 (web app) runs entirely in the browser — no account, no uploads, client-side only.
Developers working in terminals, build pipelines, or AI agent workflows (Claude Code) need the same
conversion power without opening a browser. imagesmith-cli is that tool.

---

## Roadmap

| Version | Surface     | Status         |
|---------|-------------|----------------|
| V1      | Web app     | Shipped        |
| V2      | CLI tool    | **Current**    |
| V3      | MCP server  | Planned (stub exists) |

V2 and V3 share `src/core/` — same sharp engine, two interfaces. One npm package.

---

## Locked Decisions

- [LOCKED] npm package name: `@imagesmith/cli` (scoped under @imagesmith org)
- [LOCKED] Conversion engine: `sharp` (not libwebp WASM — that's the browser's constraint)
- [LOCKED] CLI framework: `commander`
- [LOCKED] Build tool: `tsup` (ESM output, Node 20+)
- [LOCKED] Progress: `ora`
- [LOCKED] Colors: `chalk`
- [LOCKED] ZIP: `adm-zip` (read + write, single dep)
- [LOCKED] `src/mcp/` stubbed from day 1 — zero restructuring when V3 starts
- [LOCKED] Files never leave the machine — local conversion only, no server calls
- [LOCKED] Separate repo from the web app (`imagesmith-cli`)

---

## V2 CLI Commands

```bash
imagesmith convert <input> [output]
  --quality, -q <n>    WebP quality 1–100 (default: 80)
  --no-recursive       do not recurse subdirectories
  --dry-run            preview without converting

imagesmith mcp         ← stub — prints "V3 coming soon"
imagesmith --version
imagesmith --help
```

Input: single file | directory | ZIP archive
Output: auto-detected from input type

---

## The Stack

| Role       | Package     |
|------------|-------------|
| Conversion | sharp       |
| CLI        | commander   |
| Build      | tsup        |
| Spinner    | ora         |
| Colors     | chalk       |
| ZIP        | adm-zip     |
| Language   | TypeScript (strict) |
| Target     | Node 20+    |

---

## What It Must Never Become

- A server that receives remote files — local machine only
- A browser tool — that's the web app
- Paywalled — same ethos as V1
- A general image editor — WebP conversion only
- A monorepo with the web app — separate release cycle

---

## Relationship to ImageSmith Web App

|             | Web App (imageSmith) | CLI (imagesmith-cli) |
|-------------|----------------------|----------------------|
| Repo        | imageSmith           | imagesmith-cli       |
| npm         | —                    | @imagesmith/cli      |
| Engine      | libwebp WASM         | sharp                |
| Runtime     | Browser              | Node 20+             |
| Version     | V1 (shipped v0.2.0)  | V2 (in progress)     |

---

## Context Hooks (for Claude)

- Engine is `sharp` — not WASM, not ImageMagick, not anything else
- ZIP uses `adm-zip` — not `archiver` + `unzipper`, not `jszip`
- `src/mcp/` exists from day 1 — do NOT delete, do NOT fill until V3
- ESM output only — `"type": "module"` in package.json, tsup format `esm`
- `#!/usr/bin/env node` shebang is injected by tsup banner — NOT in source files
- `__VERSION__` is a tsup define constant injected from package.json at build time

---

*Last updated: 2026-08-17*
