import { Command } from "commander";

export function registerConvertCommand(program: Command): void {
  program
    .command("convert <input> [output]")
    .description(
      "Convert image(s) to WebP. Input can be a file, directory, or ZIP archive."
    )
    .option("-q, --quality <number>", "WebP quality 1–100", "80")
    .option("--no-recursive", "do not recurse into subdirectories")
    .option("--dry-run", "preview what would be converted without writing files")
    .action(
      async (
        _input: string,
        _output: string | undefined,
        _options: { quality: string; recursive: boolean; dryRun: boolean }
      ) => {
        // Phase 1: wire conversion logic from src/core/
        console.log("⚠  Conversion not yet implemented — coming in Phase 1.");
        process.exit(1);
      }
    );
}
