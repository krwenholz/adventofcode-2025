#!/usr/bin/env bun

const dayNum = parseInt(process.argv[2], 10);

if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
  console.error("Usage: bun scripts/new-day.ts <day-number>");
  console.error("Day number must be between 1 and 25");
  process.exit(1);
}

const paddedDay = dayNum.toString().padStart(2, "0");
const dayFile = `src/days/day${paddedDay}.ts`;
const testFile = `src/days/day${paddedDay}.test.ts`;
const inputFile = `inputs/day${paddedDay}.txt`;

const template = `import { Day } from "../day";

export class Day${paddedDay} extends Day {
  day = ${dayNum};
  name = "TODO: Add puzzle name";

  partOne(input: string): string | number {
    const _lines = input.trim().split("\\n");
    // TODO: Implement part one
    return "Not implemented";
  }

  partTwo(input: string): string | number {
    const _lines = input.trim().split("\\n");
    // TODO: Implement part two
    return "Not implemented";
  }
}
`;

const testTemplate = `import { test, expect, describe } from "bun:test";
import { Day${paddedDay} } from "./day${paddedDay}";

describe("Day ${dayNum}", () => {
  const day = new Day${paddedDay}();

  test("part one", () => {
    const input = "";
    const result = day.partOne(input);
    // Update with expected result from example
    expect(result).toBe("Not implemented");
  });

  test("part two", () => {
    const input = "";
    const result = day.partTwo(input);
    // Update with expected result from example
    expect(result).toBe("Not implemented");
  });
});
`;

// Check if file already exists
const existingFile = Bun.file(dayFile);
if (await existingFile.exists()) {
  console.error(`Day ${dayNum} already exists at ${dayFile}`);
  process.exit(1);
}

// Write the day file
await Bun.write(dayFile, template);
console.log(`Created ${dayFile}`);

// Write the test file
const existingTest = Bun.file(testFile);
if (!(await existingTest.exists())) {
  await Bun.write(testFile, testTemplate);
  console.log(`Created ${testFile}`);
}

// Create empty input file if it doesn't exist
const existingInput = Bun.file(inputFile);
if (!(await existingInput.exists())) {
  await Bun.write(inputFile, "");
  console.log(`Created ${inputFile}`);
}

console.log(`\nNext steps:`);
console.log(`1. Add your puzzle input to ${inputFile}`);
console.log(`2. Implement the solution in ${dayFile}`);
console.log(`3. Run with: bun run aoc day${dayNum} 1`);
