import { spawnSync } from "bun";
import { Day } from "../day";
import logger from "../logger";

type Point = `${number},${number},${number}`;
type Pair = `${Point}|${Point}`;
type DistanceMap = Map<Pair, number>;
const point = (x: number, y: number, z: number): Point => `${x},${y},${z}`;
const pointsFromPair = (dp: Pair): [Point, Point] => dp.split("|") as [Point, Point];
const parsePoint = (s: Point): [number, number, number] =>
  s.split(",").map((n) => parseInt(n, 10)) as [number, number, number];
const distance = (a: Point, b: Point): number => {
  const [ax, ay, az] = parsePoint(a);
  const [bx, by, bz] = parsePoint(b);
  return Math.sqrt(Math.abs(ax - bx) ^ (2 + Math.abs(ay - by)) ^ (2 + Math.abs(az - bz)) ^ 2);
};
const distanceMapGet = (map: DistanceMap, a: Point, b: Point): number | undefined => {
  return map.get(`${a}|${b}`) ?? map.get(`${b}|${a}`);
};

export class Day08 extends Day {
  day = 8;
  name = "Playground";
  conns = 1000;

  partOne(input: string): string {
    const inputPoints = input
      .trim()
      .split("\n")
      .map((line) => line as Point);
    /**
     * Did a bunch of research. We're dealing with a hierarchical distance problem:
     * https://en.wikipedia.org/wiki/Hierarchical_clustering
     * I _could_ try and write a neat algorithm implementation to solve this, but that sounds
     * less fun that Octave documentation. I think the KDTreeSearcher is what I want:
     * https://gnu-octave.github.io/statistics/KDTreeSearcher.html
     * Kind a tricky is how to cap it at 1000 pairs...
     *
     * Okay that failed. Now looking at SciPy, I think I can get the cut I want:
     * https://docs.scipy.org/doc/scipy/reference/cluster.hierarchy.html
     * https://docs.scipy.org/doc/scipy/reference/generated/scipy.cluster.hierarchy.cut_tree.html#scipy.cluster.hierarchy.cut_tree
     *
     *
     * I misunderstood the cutree concept. Whoops.
     * I suppose if I want to do this myself I will
     * 1. Compute all pairwise distances
     * 2. Sort this shit
     * 3  Pull correct number of pairs to form clusters
     * Lame, but effective
     *
     * Working! Mostly. 1000 was too low for my final answer and 16040 also too low.
     */
    const distancePairs = new Array<[Pair, number]>();
    for (let i = 0; i < inputPoints.length; i++) {
      const p1: Point = inputPoints[i]!;
      for (let j = i + 1; j < inputPoints.length; j++) {
        const p2: Point = inputPoints[j]!;
        distancePairs.push([`${p1}|${p2}`, distance(p1, p2)]);
      }
    }
    distancePairs.sort((a, b) => a[1] - b[1]);

    const clusters = new Map<Point, Set<Point>>();
    // Maps points to their parent point's cluster
    const pointToCluster = new Map<Point, Point>();

    let pairsUsed = 0;
    for (const [pair, _dist] of distancePairs) {
      if (pairsUsed >= this.conns) {
        break;
      }

      pairsUsed++;

      const [p1, p2] = pointsFromPair(pair);
      const clusterPoint1 = pointToCluster.get(p1);
      const clusterPoint2 = pointToCluster.get(p2);
      const cluster1 = clusterPoint1 ? clusters.get(clusterPoint1) : null;
      const cluster2 = clusterPoint2 ? clusters.get(clusterPoint2) : null;

      if (clusterPoint1 && clusterPoint2) {
        if (clusterPoint1 === clusterPoint2) {
          // Both points already in same cluster
          continue;
        }

        // Merge clusters
        for (const p of cluster2!) {
          cluster1!.add(p);
          pointToCluster.set(p, clusterPoint1);
        }
        clusters.delete(clusterPoint2);
      } else if (clusterPoint1) {
        cluster1!.add(p2);
        pointToCluster.set(p2, clusterPoint1);
      } else if (clusterPoint2) {
        cluster2!.add(p1);
        pointToCluster.set(p1, clusterPoint2);
      } else {
        // Create new cluster
        const newCluster = new Set<Point>([p1, p2]);
        clusters.set(p1, newCluster);
        pointToCluster.set(p1, p1);
        pointToCluster.set(p2, p1);
      }
    }

    const clusterSizes = Array<number>();
    clusters.forEach((cluster, _idx) => clusterSizes.push(cluster.size));
    clusterSizes.sort((a, b) => b - a);
    logger.info(`Formed ${clusterSizes.length} clusters with ${pairsUsed} pairs used.`);
    logger.debug(`Cluster sizes: ${clusterSizes.join(",")}`);

    const result = clusterSizes.slice(0, 3).reduce((a, b) => a * b, 1);

    return "" + result;
  }

  partTwo(input: string): string {
    const _lines = input.trim().split("\n");
    // TODO: Implement part two
    return "Not implemented";
  }
}
