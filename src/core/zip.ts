import AdmZip from "adm-zip";
import { writeFile, mkdtemp, rm, readFile } from "fs/promises";
import { join, extname } from "path";
import { tmpdir } from "os";
import { convertToWebP, SUPPORTED_FORMATS } from "./convert.js";

export interface ZipConvertResult {
  converted: number;
  failed: number;
  outputPath: string;
  savedBytes: number;
}

export async function processZip(
  inputZipPath: string,
  outputZipPath: string,
  quality: number
): Promise<ZipConvertResult> {
  const zip = new AdmZip(inputZipPath);
  const entries = zip.getEntries();
  const outZip = new AdmZip();
  const tmpDir = await mkdtemp(join(tmpdir(), "imagesmith-"));

  let converted = 0;
  let failed = 0;
  let savedBytes = 0;

  try {
    for (const entry of entries) {
      if (entry.isDirectory) continue;

      const entryName = entry.entryName; // e.g. "folder/image.png"
      const ext = extname(entryName).toLowerCase();

      // Non-image files pass through unchanged
      if (!SUPPORTED_FORMATS.includes(ext)) {
        outZip.addFile(entryName, entry.getData());
        continue;
      }

      // Flatten the entry path to a safe tmp filename
      const safeName = entryName.replace(/[/\\]/g, "__");
      const tmpIn = join(tmpDir, safeName);
      const tmpOut = join(tmpDir, safeName.replace(/\.[^.]+$/, ".webp"));

      await writeFile(tmpIn, entry.getData());

      try {
        const result = await convertToWebP(tmpIn, tmpOut, { quality });
        const webpBuffer = await readFile(tmpOut);
        // Preserve folder structure in output ZIP — just swap the extension
        const webpEntryName = entryName.replace(/\.[^.]+$/, ".webp");
        outZip.addFile(webpEntryName, webpBuffer);
        savedBytes += result.inputBytes - result.outputBytes;
        converted++;
      } catch {
        // Conversion failed — carry original through so the ZIP isn't broken
        outZip.addFile(entryName, entry.getData());
        failed++;
      }
    }

    outZip.writeZip(outputZipPath);
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }

  return { converted, failed, outputPath: outputZipPath, savedBytes };
}
