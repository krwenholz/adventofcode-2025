import { test, expect, describe } from "bun:test";
import { Day01 } from "./day01";

describe("Day 1", () => {
  const day = new Day01();

  test("part one", () => {
    const input = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
    const result = day.partOne(input);
    expect(result).toBe("3");
  });

  test("part one three digits", () => {
    const input = `R250`;
    const result = day.partOne(input);
    expect(result).toBe("1");
  });

  test("part two", () => {
    const input = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
    const result = day.partTwo(input);
    expect(result).toBe("6");
  });

  test("part two three digits", () => {
    const input = `R49
R300`;
    const result = day.partTwo(input);
    expect(result).toBe("3");
  });
});
