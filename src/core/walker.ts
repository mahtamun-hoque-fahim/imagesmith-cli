import { readdir, stat } from "fs/promises";
import { join, extname, relative } from "path";
import { SUPPORTED_FORMATS } from "./convert.js";

export interface WalkResult {
  absolutePath: string;
  relativePath: string;
  sizeBytes: number;
}

export async function walkDirectory(
  dir: string,
  recursive: boolean = true
): Promise<WalkResult[]> {
  const entries = await readdir(dir, {
    recursive,
    withFileTypes: true,
  });

  const results: WalkResult[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const ext = extname(entry.name).toLowerCase();
    if (!SUPPORTED_FORMATS.includes(ext)) continue;

    // entry.path = directory containing the file (Node 20+)
    const absolutePath = join(entry.path, entry.name);
    const relativePath = relative(dir, absolutePath);
    const fileStats = await stat(absolutePath);

    results.push({
      absolutePath,
      relativePath,
      sizeBytes: fileStats.size,
    });
  }

  return results;
}
