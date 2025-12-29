import { Day } from "../day";

type Point = [number, number];
type Pair = [Point, Point];
const parsePoint = (s: string): [number, number] =>
  s.split(",").map((n) => parseInt(n, 10)) as [number, number];
const area = (a: Point, b: Point): number => {
  const [ax, ay] = a;
  const [bx, by] = b;
  return (Math.abs(bx - ax) + 1) * (Math.abs(by - ay) + 1);
};

export class Day09 extends Day {
  day = 9;
  name = "Movie Theatre";

  partOne(input: string): string {
    /**
     * So now we need to calculate the largest possible area for two points.
     * This seems like a straightforward combinatorial problem.
     */
    const points: Point[] = input.trim().split("\n").map(parsePoint);
    let maxArea = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i]!;
        const b = points[j]!;
        const aArea = area(a, b);
        if (aArea > maxArea) {
          maxArea = aArea;
        }
      }
    }
    return maxArea.toString();
  }

  partTwo(input: string): string {
    const _lines = input.trim().split("\n");
    // TODO: Implement part two
    return "Not implemented";
  }
}
