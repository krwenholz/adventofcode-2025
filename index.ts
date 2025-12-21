#!/usr/bin/env bun

import { Command } from "commander";
import { days } from "./src/days";
import { setVerbose } from "./src/logger";

const banner = `
❄️  ❄️  ❄️  ❄️  ❄️  ❄️  ❄️  ❄️  ❄️  ❄️
🎅        Advent of Code 2025       🎅
🎄      Solutions by krwenholz      🎄
❄️  ❄️  ❄️  ❄️  ❄️  ❄️  ❄️  ❄️  ❄️  ❄️
`;

const program = new Command()
  .name("aoc")
  .description("Advent of Code 2025 solutions")
  .version("1.0.0")
  .option("-v, --verbose", "Enable debug logging")
  .hook("preAction", (thisCommand) => {
    setVerbose(thisCommand.opts().verbose ?? false);
    console.log(banner);
  });

// Register all day commands
for (const day of days) {
  program.addCommand(day.createCommand());
}

program.parse();
