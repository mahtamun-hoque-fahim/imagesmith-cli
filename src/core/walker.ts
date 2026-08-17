// Phase 1: recursive directory walker with image filtering

export interface WalkResult {
  absolutePath: string;
  relativePath: string;
  sizeBytes: number;
}

export async function walkDirectory(
  _dir: string,
  _recursive: boolean = true
): Promise<WalkResult[]> {
  // TODO: Phase 1 — fs.readdir recursive walk, filter by SUPPORTED_FORMATS
  throw new Error("walkDirectory not yet implemented");
}
