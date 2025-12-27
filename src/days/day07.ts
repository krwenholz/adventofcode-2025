import { env } from "bun";
import { Day } from "../day";
import logger from "../logger";

type Pos = `${number},${number}`;
const pos = (row: number, col: number): Pos => `${row},${col}`;
const parsePos = (p: Pos): [number, number] => p.split(",").map(Number) as [number, number];
const move = (p: Pos, dir: number, grid: String[][]): Pos[] => {
  const [row, col] = parsePos(p);
  const nextRow = row + 1;

  if (nextRow >= grid.length) return [];
  const cell = grid[nextRow]![col];

  switch (cell) {
    case ".":
      return [pos(nextRow, col)];
    case "^":
      return [pos(nextRow, col - 1), pos(nextRow, col + 1)];
    default:
      return [];
  }
};

export class Day07 extends Day {
  day = 7;
  name = "Laboratories";

  partOne(input: string): string {
    let lines = input
      .trim()
      .split("\n")
      .map((l) => l.split(""));
    /*
     * We'll track beams using a set to avoid duplicates.
     * We'll then run an increment loop to create a new set for each step.
     * Along the way, we track splits (hits of `^`)
     */
    let beams = new Set<Pos>([pos(0, lines[0]!.indexOf("S"))]);
    let allBeams = new Set<Pos>(beams);
    let splits = 0;
    logger.debug(`Initial beams: ${[...beams].join("; ")}`);
    for (let row = 1; row < lines.length; row++) {
      const newBeams = new Set<Pos>();
      for (const beam of beams) {
        const movedBeams = move(beam, row, lines);
        if (movedBeams.length > 1) {
          splits++;
        }
        for (const mb of movedBeams) {
          newBeams.add(mb);
        }
      }
      beams = newBeams;
      allBeams = allBeams.union(beams);
    }
    if (env.VISUALIZE === "true") {
      for (const b of allBeams) {
        const [r, c] = parsePos(b);
        lines[r]![c] = "|";
      }
      for (const line of lines) {
        console.log(line.join(""));
      }
    }
    return "" + splits;
  }

  partTwo(input: string): string {
    const grid = input
      .trim()
      .split("\n")
      .map((l) => l.split(""));
    /*
     * Now we need to calculate the possible paths taken
     * I like a recursive algorithm with memoization for this.
     * Root node is s
     * At each node, we run move to get new choices.
     * Then we follow just _one_ node.
     * We memoize the number of paths from each node as we come back up.
     */
    const startPos = pos(0, grid[0]!.indexOf("S"));
    const timelinesFromPos = new Map<Pos, number>();
    this.traverseFrom(startPos, grid, timelinesFromPos);

    if (env.VISUALIZE === "true") {
      for (const ts of timelinesFromPos) {
        const [r, c] = parsePos(ts[0]);
        grid[r]![c] = `${ts[1]}`;
      }
      for (const line of grid) {
        console.log(line.join(""));
      }
    }
    return "" + timelinesFromPos.get(startPos);
  }

  traverseFrom(pos: Pos, grid: String[][], memo: Map<Pos, number>): number {
    if (memo.has(pos)) {
      return memo.get(pos)!;
    }
    const moves = move(pos, 0, grid);
    if (moves.length === 0) {
      memo.set(pos, 1);
      return 1;
    }
    let totalTimelines = 0;
    for (const m of moves) {
      totalTimelines += this.traverseFrom(m, grid, memo);
    }
    memo.set(pos, totalTimelines);
    return totalTimelines;
  }
}
