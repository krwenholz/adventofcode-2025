import { test, expect, describe } from "bun:test";
import { Day02 } from "./day02";

describe("Day 2", () => {
  const day = new Day02();

  test("part one", () => {
    const input =
      "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124";
    const result = day.partOne(input);
    expect(result).toBe("Not implemented");
  });

  test("part two", () => {
    const input = "";
    const result = day.partTwo(input);
    // Update with expected result from example
    expect(result).toBe("Not implemented");
  });
});
