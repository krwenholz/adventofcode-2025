import { test, expect, describe } from "bun:test";
import { Day03 } from "./day03";

describe("Day 3", () => {
  const day = new Day03();

  test("part one", () => {
    const input = `987654321111111
811111111111119
234234234234278
818181911112111`;
    const result = day.partOne(input);
    expect(result).toBe("357");
  });

  test("part two", () => {
    const input = `987654321111111
811111111111119
234234234234278
818181911112111`;
    const result = day.partTwo(input);
    // TODO: Update with expected result from example
    expect(result).toBe("3121910778619");
  });
});
