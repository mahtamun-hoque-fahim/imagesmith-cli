# imagesmith

> Convert any image or folder to WebP — free, private, no uploads.

The CLI companion to [ImageSmith](https://imagesmith.vercel.app).
All conversion happens on your machine. No accounts. No servers. No limits.

[![npm version](https://img.shields.io/npm/v/@imagesmith/cli)](https://www.npmjs.com/package/@imagesmith/cli)
[![license](https://img.shields.io/npm/l/@imagesmith/cli)](./LICENSE)

---

## Requirements

- Node.js 20 or higher

## Install

```bash
npm install -g @imagesmith/cli
```

---

## Usage

### Single file

```bash
imagesmith convert photo.png
# → photo.webp (same directory)

imagesmith convert photo.png ./out/photo.webp
# → custom output path
```

### Entire folder

```bash
imagesmith convert ./assets
# → ./assets-webp/ (folder structure preserved)

imagesmith convert ./assets ./public/images --quality 90
# → custom output folder, quality 90
```

### ZIP archive

```bash
imagesmith convert assets.zip
# → assets-webp.zip (folder structure preserved)

imagesmith convert assets.zip output.zip --quality 75
```

### Preview without converting

```bash
imagesmith convert ./assets --dry-run
```

---

## Options

| Flag | Default | Description |
|---|---|---|
| `--quality, -q <n>` | `80` | WebP quality (1–100) |
| `--no-recursive` | — | Do not recurse into subdirectories |
| `--dry-run` | — | Preview files that would be converted |

---

## Supported Formats

`.jpg` `.jpeg` `.png` `.gif` `.tiff` `.tif` `.avif` `.bmp`

---

## How it works

ImageSmith uses [sharp](https://sharp.pixelplumbing.com/) for conversion.
Files never leave your machine. No network requests are made during conversion.

---

## Roadmap

- **V2** — CLI tool ✓ (current)
- **V3** — MCP server mode for Claude Code and agentic workflows

---

## License

MIT © [Mahtamun Hoque Fahim](https://github.com/mahtamun-hoque-fahim)
