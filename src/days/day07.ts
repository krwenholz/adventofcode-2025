import { env } from "bun";
import { Day } from "../day";
import logger from "../logger";

type BeamPos = `${number},${number}`;
const pos = (row: number, col: number): BeamPos => `${row},${col}`;
const parsePos = (p: BeamPos): [number, number] => p.split(",").map(Number) as [number, number];
const moveBeam = (p: BeamPos, dir: number, grid: String[][]): BeamPos[] => {
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
    let beams = new Set<BeamPos>([pos(0, lines[0]!.indexOf("S"))]);
    let allBeams = new Set<BeamPos>(beams);
    let splits = 0;
    logger.debug(`Initial beams: ${[...beams].join("; ")}`);
    for (let row = 1; row < lines.length; row++) {
      const newBeams = new Set<BeamPos>();
      for (const beam of beams) {
        const movedBeams = moveBeam(beam, row, lines);
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
    const _lines = input.trim().split("\n");
    // TODO: Implement part two
    return "Not implemented";
  }
}
