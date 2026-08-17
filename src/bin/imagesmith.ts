import { Command } from "commander";
import { registerConvertCommand } from "../cli/commands/convert.js";
import { registerMcpCommand } from "../cli/commands/mcp.js";

const program = new Command();

program
  .name("imagesmith")
  .description("Convert any image or folder to WebP — free, private, no uploads.")
  .version(__VERSION__, "-v, --version", "output the current version");

registerConvertCommand(program);
registerMcpCommand(program);

program.parse();
