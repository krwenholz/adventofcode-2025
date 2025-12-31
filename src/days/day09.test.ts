import { test, expect, describe } from "bun:test";
import { Day09 } from "./day09";

describe("Day 9", () => {
  const day = new Day09();

  test("part one", () => {
    const input = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;
    const result = day.partOne(input);
    expect(result).toBe("50");
  });

  test("part two", () => {
    const input = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;
    const result = day.partTwo(input);
    expect(result).toBe("24");
  });
});
