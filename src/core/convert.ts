// Phase 1: sharp-based WebP conversion
// import sharp from "sharp";

export interface ConvertOptions {
  quality: number;
}

export interface ConvertResult {
  inputPath: string;
  outputPath: string;
  inputBytes: number;
  outputBytes: number;
}

export const SUPPORTED_FORMATS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".tiff",
  ".tif",
  ".avif",
  ".bmp",
];

export async function convertToWebP(
  _inputPath: string,
  _outputPath: string,
  _options: ConvertOptions
): Promise<ConvertResult> {
  // TODO: Phase 1 — replace with sharp conversion
  throw new Error("convertToWebP not yet implemented");
}
