import { test, expect, describe } from "bun:test";
import { Day04 } from "./day04";

describe("Day 4", () => {
  const day = new Day04();

  test("part one", () => {
    const input = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;
    const result = day.partOne(input);
    expect(result).toBe("13");
  });

  test("part two", () => {
    const input = "";
    const result = day.partTwo(input);
    // TODO: Update with expected result from example
    expect(result).toBe("Not implemented");
  });
});
