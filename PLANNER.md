# PLANNER.md — imagesmith-cli

---

## Phase 0 — Scaffold ✅

Goal: `imagesmith --version` and `imagesmith --help` work. Full structure in place.

- [x] package.json (name: imagesmith, type: module)
- [x] tsconfig.json (ESNext + Bundler resolution)
- [x] tsup.config.ts (bin + index entries, __VERSION__ define)
- [x] src/bin/imagesmith.ts (commander setup)
- [x] src/cli/commands/convert.ts (stub)
- [x] src/cli/commands/mcp.ts (V3 stub)
- [x] src/core/convert.ts (stub)
- [x] src/core/walker.ts (stub)
- [x] src/core/zip.ts (stub)
- [x] src/mcp/index.ts (V3 stub)
- [x] src/mcp/tools/convert_file.ts (V3 stub)
- [x] src/mcp/tools/convert_directory.ts (V3 stub)
- [x] src/index.ts (public API exports)
- [x] BRAIN.md, PLANNER.md, AGENTS.md, README.md

---

## Phase 1 — Core Engine ✅

Goal: `imagesmith convert image.png` actually works.

**convert.ts**
- [x] Import sharp
- [x] Implement convertToWebP(inputPath, outputPath, options)
- [x] mkdir output dir recursively before writing (handles nested structures)
- [x] Return inputBytes + outputBytes for savings summary

**walker.ts**
- [x] fs.readdir with recursive flag (Node 20 native)
- [x] Filter by SUPPORTED_FORMATS extension
- [x] Return absolutePath + relativePath + sizeBytes per file
- [x] Non-image files (txt, etc.) skipped correctly

**zip.ts**
- [x] adm-zip: read ZIP entries
- [x] Extract each image entry to tmp dir (os.tmpdir())
- [x] convertToWebP per entry
- [x] adm-zip: repack with .webp extensions, same folder structure preserved
- [x] Non-image files pass through unchanged
- [x] Failed entries carry original through (ZIP never broken)
- [x] Clean up tmp dir in finally block

---

## Phase 2 — CLI Commands ✅

Goal: all three input types work end-to-end with progress and summary.

**convert command**
- [x] Detect input type: file | directory | ZIP (by stat + extension)
- [x] Route to correct core function
- [x] ora spinner during conversion
- [x] chalk summary: `3 files converted · saved 2.1 KB · 31ms`
- [x] --dry-run: list files that would convert, show count, exit 0
- [x] --quality: parse + validate 1–100, default 80
- [x] --no-recursive: pass to walker
- [x] Error handling: bad format, bad path, permission denied
- [x] Exit codes: 0 success, 1 error, 2 no files found
- [x] listZipImages helper added to zip.ts for dry-run ZIP inspection

---

## Phase 3 — Polish ✅

Goal: production-ready for npm publish.

- [x] `--help` examples block on convert command
- [x] LICENSE file (MIT)
- [x] README expanded: install, usage for all 3 input types, options table, supported formats
- [x] npm pack --dry-run verified: 6 files, 5.4 KB — no src/docs/config leaked
- [x] `npm run lint` passes clean (tsc --noEmit, zero errors)

---

## Phase 4 — Ship ✅

- [x] npm publish — `@imagesmith/cli@0.1.0` live at https://www.npmjs.com/package/@imagesmith/cli
- [x] package.json auto-corrected (bin key, repository URL normalized)
- [ ] gh-meta: cut v0.1.0 GitHub release, fill About, add topics

---

## Phase 5 — V3 (MCP Server Mode) — Future

- [ ] Install @modelcontextprotocol/sdk
- [ ] Fill src/mcp/index.ts: startMCPServer()
- [ ] Implement convert_file tool
- [ ] Implement convert_directory tool
- [ ] `imagesmith mcp` starts the server
- [ ] README: MCP setup instructions for Claude Code
- [ ] npm publish as patch/minor bump
