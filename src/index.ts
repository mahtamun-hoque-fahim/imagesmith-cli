// Public programmatic API
export { convertToWebP, SUPPORTED_FORMATS } from "./core/convert.js";
export { walkDirectory } from "./core/walker.js";
export { processZip, listZipImages } from "./core/zip.js";
export type { ConvertOptions, ConvertResult } from "./core/convert.js";
export type { WalkResult } from "./core/walker.js";
export type { ZipConvertResult } from "./core/zip.js";
