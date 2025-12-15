#!/usr/bin/env bun

const dayNum = parseInt(process.argv[2], 10);

if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
  console.error("Usage: bun scripts/new-day.ts <day-number>");
  console.error("Day number must be between 1 and 25");
  process.exit(1);
}

const paddedDay = dayNum.toString().padStart(2, "0");
const dayFile = `src/days/day${paddedDay}.ts`;
const inputFile = `inputs/day${paddedDay}.txt`;

const template = `import { Day } from "../day";

export class Day${paddedDay} extends Day {
  day = ${dayNum};
  name = "TODO: Add puzzle name";

  partOne(input: string): string | number {
    const lines = input.trim().split("\\n");
    // TODO: Implement part one
    return "Not implemented";
  }

  partTwo(input: string): string | number {
    const lines = input.trim().split("\\n");
    // TODO: Implement part two
    return "Not implemented";
  }
}
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

// Create empty input file if it doesn't exist
const existingInput = Bun.file(inputFile);
if (!(await existingInput.exists())) {
  await Bun.write(inputFile, "");
  console.log(`Created ${inputFile}`);
}

console.log(`\nNext steps:`);
console.log(`1. Add your puzzle input to ${inputFile}`);
console.log(`2. Implement the solution in ${dayFile}`);
console.log(`3. Register the day in src/days/index.ts:`);
console.log(`   import { Day${paddedDay} } from "./day${paddedDay}";`);
console.log(`   export const days = [..., new Day${paddedDay}()];`);
console.log(`4. Run with: bun run aoc day${dayNum} 1`);
