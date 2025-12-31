import { env } from "bun";
import { Day } from "../day";
import { polygonContains } from "d3";
import logger from "../logger";

type Point = [number, number];
type Pair = [Point, Point];
const pointToString = (p: Point): string => `${p[0]},${p[1]}`;
const parsePoint = (s: string): [number, number] =>
  s.split(",").map((n) => parseInt(n, 10)) as [number, number];
const area = (a: Point, b: Point): number => {
  const [ar, ac] = a;
  const [br, bc] = b;
  return (Math.abs(br - ar) + 1) * (Math.abs(bc - ac) + 1);
};
const visualize = (points: Map<string, boolean>): string => {
  // TODO: I have this reversed but can't for the life of me figure out why
  const rs = Array.from(points.keys()).map((p) => parsePoint(p)[1]);
  const cs = Array.from(points.keys()).map((p) => parsePoint(p)[0]);
  const minR = Math.min(...rs);
  const maxR = Math.max(...rs);
  const minC = Math.min(...cs);
  const maxC = Math.max(...cs);
  let paddingRow = "";
  for (let col = minC - 1; col <= maxC + 1; col++) {
    paddingRow += ".";
  }
  paddingRow += "\n";
  let output = paddingRow;
  for (let row = minR; row <= maxR; row++) {
    output += ".";
    for (let col = minC; col <= maxC; col++) {
      if (points.has(pointToString([col, row]))) {
        output += "#";
      } else {
        output += ".";
      }
    }
    output += ".\n";
  }
  output += paddingRow;
  return output;
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
    /**
     * Same, but now I need to constrain myself to an interior drawn
     * by chaining the points as if they were connected edges in a polygon.
     *
     * Ray casting!
     *
     * But I've implemented that before and don't feel like doing it again.
     * This year, let's use d3!
     *
     * Dumbest solution just does part one but checks if all points are in the polygon before accepting. We'll try that to start.
     * To be really smart, we'll memoize that check as we do it.
     *
     * Mmmm I think I'm holding d3 wrong. Once we've drawn the bounding area, we could pretty easily memoize the rest?
     */
    const points: Point[] = input.trim().split("\n").map(parsePoint);
    const pipMemo = new Map<string, boolean>();
    for (let i = 0; i < points.length; i++) {
      pipMemo.set(pointToString(points[i]!), true);
      const nextPoint = points[(i + 1) % points.length]!;
      for (
        let row = Math.min(points[i]![0], nextPoint[0]);
        row <= Math.max(points[i]![0], nextPoint[0]);
        row++
      ) {
        for (
          let col = Math.min(points[i]![1], nextPoint[1]);
          col <= Math.max(points[i]![1], nextPoint[1]);
          col++
        ) {
          pipMemo.set(pointToString([row, col]), true);
        }
      }
    }
    const pointsForD3: [number, number][] = points.map((p) => [p[1], p[0]]);
    const pointInPolygon = (p: Point): boolean => {
      const pStr = pointToString(p);
      if (pipMemo.has(pStr)) {
        return pipMemo.get(pStr)!;
      }
      pipMemo.set(pStr, polygonContains(pointsForD3, [p[1], p[0]]));
      return pipMemo.get(pStr)!;
    };

    let maxArea = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i]!;
        const b = points[j]!;
        const aArea = area(a, b);
        if (aArea > maxArea) {
          // Check if all points are in the main polygon
          const [ar, ac] = a;
          const [br, bc] = b;
          const aPoints: Point[] = [];
          for (let row = Math.min(ar, br); row <= Math.max(ar, br); row++) {
            for (let col = Math.min(ac, bc); col <= Math.max(ac, bc); col++) {
              aPoints.push([row, col]);
            }
          }
          const allInside = aPoints.every(pointInPolygon);
          if (allInside) {
            maxArea = aArea;
          }
        }
      }
    }

    if (env.VISUALIZE) {
      console.log(pipMemo);
      logger.debug("Visualization of point-in-polygon memoization:");
      console.log(visualize(pipMemo));
    }
    return maxArea.toString();
  }
}
