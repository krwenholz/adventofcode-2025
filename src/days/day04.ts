import { Day } from "../day";

const PAPER = "@";

function countAdjacentPaper(grid: string[][], row: number, col: number): number {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue; // Skip the center cell
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[r]!.length) {
        if (grid[r]![c]! === PAPER) {
          count++;
        }
      }
    }
  }
  return count;
}

export class Day04 extends Day {
  day = 4;
  name = "Printing Department";

  partOne(input: string): string | number {
    const _lines = input.trim().split("\n");
    /**
     * '@' represents a roll of paper
     * it is accessible if it is adjacent to fewer than 4 rolls of paper (in the 8 spaces around it)
     */
    const grid: string[][] = _lines.map((line) => line.split(""));
    let accessibleCount = 0;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r]!.length; c++) {
        if (grid[r]![c]! === PAPER) {
          if (countAdjacentPaper(grid, r, c) < 4) {
            accessibleCount++;
          }
        }
      }
    }
    return `${accessibleCount}`;
  }

  partTwo(input: string): string | number {
    const _lines = input.trim().split("\n");
    // TODO: Implement part two
    return "Not implemented";
  }
}
