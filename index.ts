#!/usr/bin/env bun

import { Command } from "commander";
import { days } from "./src/days";

const program = new Command()
  .name("aoc")
  .description("Advent of Code 2025 solutions")
  .version("1.0.0");

// Register all day commands
for (const day of days) {
  program.addCommand(day.createCommand());
}

program.parse();
