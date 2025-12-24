import { test, expect, describe } from "bun:test";
import { Day06 } from "./day06";

describe("Day 6", () => {
  const day = new Day06();

  test("part one", () => {
    const input = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;
    const result = day.partOne(input);
    expect(result).toBe("4277556");
  });

  test("part two", () => {
    const input = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   + `;
    const result = day.partTwo(input);
    expect(result).toBe("3263827");
  });
});
