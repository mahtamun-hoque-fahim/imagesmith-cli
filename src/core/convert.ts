import sharp from "sharp";
import { stat, mkdir } from "fs/promises";
import { dirname } from "path";

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
  inputPath: string,
  outputPath: string,
  options: ConvertOptions
): Promise<ConvertResult> {
  const inputStats = await stat(inputPath);

  // Ensure output directory exists (handles nested folder structures)
  await mkdir(dirname(outputPath), { recursive: true });

  await sharp(inputPath)
    .webp({ quality: options.quality })
    .toFile(outputPath);

  const outputStats = await stat(outputPath);

  return {
    inputPath,
    outputPath,
    inputBytes: inputStats.size,
    outputBytes: outputStats.size,
  };
}
