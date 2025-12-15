import { test, expect, describe } from "bun:test";
import { Day01 } from "./day01";

describe("Day 1", () => {
  const day = new Day01();

  test("part one", () => {
    const input = `hello
world`;
    const result = day.partOne(input);
    // Update this test when you implement the solution
    expect(result).toBe("Not implemented");
  });

  test("part two", () => {
    const input = `hello
world`;
    const result = day.partTwo(input);
    // Update this test when you implement the solution
    expect(result).toBe("Not implemented");
  });
});
