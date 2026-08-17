import { Command } from "commander";

export function registerMcpCommand(program: Command): void {
  program
    .command("mcp")
    .description("Start ImageSmith MCP server (coming in V3)")
    .action(() => {
      console.log("ImageSmith MCP server — V3 coming soon.");
    });
}
