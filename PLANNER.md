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

## Phase 1 — Core Engine

Goal: `imagesmith convert image.png` actually works.

**convert.ts**
- [ ] Import sharp
- [ ] Implement convertToWebP(inputPath, outputPath, options)
- [ ] Validate input format against SUPPORTED_FORMATS
- [ ] Return inputBytes + outputBytes for savings summary

**walker.ts**
- [ ] fs.readdir with recursive flag (Node 18.17+ native recursive option)
- [ ] Filter by SUPPORTED_FORMATS extension
- [ ] Return absolutePath + relativePath + sizeBytes per file

**zip.ts**
- [ ] adm-zip: read ZIP entries
- [ ] Extract each image entry to tmp dir (os.tmpdir())
- [ ] convertToWebP per entry
- [ ] adm-zip: repack with .webp extensions, same folder structure
- [ ] Clean up tmp dir

---

## Phase 2 — CLI Commands (wire Phase 1 into commander)

Goal: all three input types work end-to-end with progress and summary.

**convert command**
- [ ] Detect input type: file | directory | ZIP (by stat + extension)
- [ ] Route to correct core function
- [ ] ora spinner during conversion ("Converting 47 files...")
- [ ] chalk summary on finish:
      `✓ 47 files converted · 14.2 MB saved · 3.2s`
- [ ] --dry-run: list files that would convert, show estimated count, exit 0
- [ ] --quality: parse + validate 1–100, default 80
- [ ] --no-recursive: pass to walker
- [ ] Handle errors gracefully (bad format, permission denied, empty dir)

---

## Phase 3 — Polish

Goal: production-ready for npm publish.

- [ ] Clean `--help` output with examples
- [ ] Exit codes: 0 success, 1 error, 2 no files found
- [ ] README with install + usage examples
- [ ] .npmignore (exclude src/, *.md except README)
- [ ] Test on macOS + Linux (sharp binary check)

---

## Phase 4 — Ship

- [ ] npm publish (package name: imagesmith)
- [ ] gh-meta: cut v0.2.0 release, fill About, tag

---

## Phase 5 — V3 (MCP Server Mode) — Future

- [ ] Install @modelcontextprotocol/sdk
- [ ] Fill src/mcp/index.ts: startMCPServer()
- [ ] Implement convert_file tool
- [ ] Implement convert_directory tool
- [ ] `imagesmith mcp` starts the server
- [ ] README: MCP setup instructions for Claude Code
- [ ] npm publish as patch/minor bump
