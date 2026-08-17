// Phase 1: ZIP unpack → convert each image → repack with same folder structure
// Uses adm-zip for both reading and writing

export interface ZipConvertResult {
  converted: number;
  failed: number;
  outputPath: string;
}

export async function processZip(
  _inputZipPath: string,
  _outputZipPath: string,
  _quality: number
): Promise<ZipConvertResult> {
  // TODO: Phase 1 — adm-zip unpack, convertToWebP per entry, adm-zip repack
  throw new Error("processZip not yet implemented");
}
