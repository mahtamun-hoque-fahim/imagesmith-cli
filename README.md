# imagesmith

> Convert any image or folder to WebP — free, private, no uploads.

The CLI companion to [ImageSmith](https://github.com/mahtamun-hoque-fahim/imageSmith).
All conversion happens on your machine. No accounts. No servers.

---

## Install

```bash
npm install -g imagesmith
```

## Usage

```bash
# Single file
imagesmith convert photo.png

# Entire folder (recursive by default)
imagesmith convert ./assets

# ZIP archive → ZIP output
imagesmith convert assets.zip

# Custom quality + output path
imagesmith convert ./assets ./assets-webp --quality 90

# Preview without converting
imagesmith convert ./assets --dry-run
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `--quality, -q` | `80` | WebP quality (1–100) |
| `--no-recursive` | — | Do not recurse subdirectories |
| `--dry-run` | — | Preview without writing files |

---

## Roadmap

- **V2** — CLI tool (current)
- **V3** — MCP server mode for Claude Code and agent workflows

---

## License

MIT © [Mahtamun Hoque Fahim](https://github.com/mahtamun-hoque-fahim)
