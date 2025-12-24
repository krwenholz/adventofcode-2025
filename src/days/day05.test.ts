import { test, expect, describe } from "bun:test";
import { Day05 } from "./day05";

describe("Day 5", () => {
  const day = new Day05();

  test("part one", () => {
    const input = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;
    const result = day.partOne(input);
    expect(result).toBe("3");
  });

  test("part two", () => {
    const input = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;
    const result = day.partTwo(input);
    expect(result).toBe("14");
  });
});
