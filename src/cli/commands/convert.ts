import { Command } from "commander";
import { stat } from "fs/promises";
import { extname, basename, join, dirname } from "path";
import chalk from "chalk";
import ora from "ora";
import { convertToWebP, SUPPORTED_FORMATS } from "../../core/convert.js";
import { walkDirectory } from "../../core/walker.js";
import { processZip, listZipImages } from "../../core/zip.js";

type InputType = "file" | "directory" | "zip";

interface ConvertOptions {
  quality: string;
  recursive: boolean;
  dryRun: boolean;
}

function formatBytes(bytes: number): string {
  const abs = Math.abs(bytes);
  if (abs < 1024) return `${bytes} B`;
  if (abs < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDuration(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

async function detectInputType(input: string): Promise<InputType> {
  const s = await stat(input);
  if (s.isDirectory()) return "directory";
  if (extname(input).toLowerCase() === ".zip") return "zip";
  return "file";
}

function resolveOutputPath(
  input: string,
  output: string | undefined,
  type: InputType
): string {
  if (output) return output;
  if (type === "file") {
    return join(dirname(input), basename(input, extname(input)) + ".webp");
  }
  if (type === "directory") {
    return input.replace(/\/+$/, "") + "-webp";
  }
  return join(dirname(input), basename(input, extname(input)) + "-webp.zip");
}

export function registerConvertCommand(program: Command): void {
  program
    .command("convert <input> [output]")
    .description(
      "Convert image(s) to WebP. Input can be a file, directory, or ZIP archive."
    )
    .option("-q, --quality <number>", "WebP quality 1-100", "80")
    .option("--no-recursive", "do not recurse into subdirectories")
    .option("--dry-run", "preview what would be converted without writing files")
    .action(
      async (input: string, output: string | undefined, opts: ConvertOptions) => {
        const quality = parseInt(opts.quality, 10);

        if (isNaN(quality) || quality < 1 || quality > 100) {
          console.error(chalk.red("x --quality must be a number between 1 and 100."));
          process.exit(1);
        }

        let type: InputType;
        try {
          type = await detectInputType(input);
        } catch {
          console.error(chalk.red(`x Cannot access: ${input}`));
          process.exit(1);
        }

        if (type === "file") {
          const ext = extname(input).toLowerCase();
          if (!SUPPORTED_FORMATS.includes(ext)) {
            console.error(chalk.red(`x Unsupported format: ${ext}`));
            console.error(chalk.dim(`  Supported: ${SUPPORTED_FORMATS.join("  ")}`));
            process.exit(1);
          }
        }

        const outputPath = resolveOutputPath(input, output, type);
        const start = Date.now();

        // DRY RUN
        if (opts.dryRun) {
          console.log(chalk.cyan("Dry run -- no files will be written.\n"));

          if (type === "file") {
            console.log(`  ${chalk.dim(input)} -> ${chalk.green(outputPath)}`);
            console.log(chalk.cyan("\n1 file would be converted."));

          } else if (type === "directory") {
            const files = await walkDirectory(input, opts.recursive);
            if (files.length === 0) {
              console.log(chalk.yellow("  No supported image files found."));
            } else {
              for (const f of files) {
                const out = join(outputPath, f.relativePath.replace(/\.[^.]+$/, ".webp"));
                console.log(`  ${chalk.dim(f.relativePath)} -> ${chalk.green(out)}`);
              }
              console.log(chalk.cyan(`\n${files.length} file${files.length !== 1 ? "s" : ""} would be converted.`));
            }

          } else {
            const entries = listZipImages(input);
            if (entries.length === 0) {
              console.log(chalk.yellow("  No supported image files found in ZIP."));
            } else {
              for (const e of entries) {
                const out = e.replace(/\.[^.]+$/, ".webp");
                console.log(`  ${chalk.dim(e)} -> ${chalk.green(out)}`);
              }
              console.log(chalk.cyan(`\n${entries.length} file${entries.length !== 1 ? "s" : ""} would be converted.`));
            }
          }
          return;
        }

        // SINGLE FILE
        if (type === "file") {
          const spinner = ora(`Converting ${basename(input)}...`).start();
          try {
            const result = await convertToWebP(input, outputPath, { quality });
            const saved = result.inputBytes - result.outputBytes;
            spinner.succeed(
              `${chalk.green(basename(input))} -> ${chalk.green(basename(outputPath))}  ` +
              chalk.dim(`${formatBytes(result.inputBytes)} -> ${formatBytes(result.outputBytes)} · saved ${formatBytes(saved)} · ${formatDuration(Date.now() - start)}`)
            );
          } catch (err) {
            spinner.fail(chalk.red(`x Conversion failed: ${(err as Error).message}`));
            process.exit(1);
          }

        // DIRECTORY
        } else if (type === "directory") {
          const spinner = ora("Scanning directory...").start();
          const files = await walkDirectory(input, opts.recursive);

          if (files.length === 0) {
            spinner.warn(chalk.yellow("No supported image files found."));
            process.exit(2);
          }

          spinner.text = `Converting 0 / ${files.length} files...`;
          let converted = 0;
          let failed = 0;
          let totalSaved = 0;

          for (const file of files) {
            const outPath = join(outputPath, file.relativePath.replace(/\.[^.]+$/, ".webp"));
            try {
              const result = await convertToWebP(file.absolutePath, outPath, { quality });
              totalSaved += result.inputBytes - result.outputBytes;
              converted++;
            } catch {
              failed++;
            }
            spinner.text = `Converting ${converted + failed} / ${files.length} files...`;
          }

          const duration = formatDuration(Date.now() - start);
          if (failed === 0) {
            spinner.succeed(
              `${chalk.green(`${converted} file${converted !== 1 ? "s" : ""} converted`)} · ` +
              chalk.dim(`saved ${formatBytes(totalSaved)} · ${duration}`)
            );
          } else {
            spinner.warn(
              `${converted} converted · ${chalk.red(`${failed} failed`)} · ` +
              chalk.dim(`saved ${formatBytes(totalSaved)} · ${duration}`)
            );
          }

        // ZIP
        } else {
          const spinner = ora("Converting ZIP...").start();
          try {
            const result = await processZip(input, outputPath, quality);
            const duration = formatDuration(Date.now() - start);
            if (result.failed === 0) {
              spinner.succeed(
                `${chalk.green(`${result.converted} file${result.converted !== 1 ? "s" : ""} converted`)} · ` +
                chalk.dim(`saved ${formatBytes(result.savedBytes)} · ${duration}`)
              );
            } else {
              spinner.warn(
                `${result.converted} converted · ${chalk.red(`${result.failed} failed`)} · ` +
                chalk.dim(`saved ${formatBytes(result.savedBytes)} · ${duration}`)
              );
            }
          } catch (err) {
            spinner.fail(chalk.red(`x ZIP processing failed: ${(err as Error).message}`));
            process.exit(1);
          }
        }
      }
    );
}
