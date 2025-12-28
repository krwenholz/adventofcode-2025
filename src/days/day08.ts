import { Day } from "../day";
import logger from "../logger";

type Point = [number, number, number];
type Pair = [Point, Point];
const parsePoint = (s: string): [number, number, number] =>
  s.split(",").map((n) => parseInt(n, 10)) as [number, number, number];
const distance = (a: Point, b: Point): number => {
  const [ax, ay, az] = a;
  const [bx, by, bz] = b;
  return Math.pow(ax - bx, 2) + Math.pow(ay - by, 2) + Math.pow(az - bz, 2);
};

export class Day08 extends Day {
  day = 8;
  name = "Playground";
  conns = 1000;

  partOne(input: string): string {
    const inputPoints = input
      .trim()
      .split("\n")
      .map((line) => parsePoint(line));
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
     * Working! Mostly. 1000 was too low for my final answer and 16040 also too low. And 19925 is too low ater trying earlier iterations.
     * I'm noticing seriously tight clusters with nearly identical distances. The comparison had to be changed to just >. This did result
     * in a new value, but not high enough.
     *
     * Finally got my correct answer by removing the sqrt call. Key insight was the very close distances. The sqrt was probably rounding
     * at too low of a precision. Takes 350ms.
     *
     * After reviewing with Claude, I reduced our string parsing to cut ~50% of the execution time. Nice! Any faster probably requires a
     * different algorithm. (Kruskal's MST came up in research.)
     */
    const distancePairs = new Array<[Pair, number]>();
    for (let i = 0; i < inputPoints.length; i++) {
      const p1: Point = inputPoints[i]!;
      for (let j = i + 1; j < inputPoints.length; j++) {
        const p2: Point = inputPoints[j]!;
        distancePairs.push([[p1, p2], distance(p1, p2)]);
      }
    }
    distancePairs.sort((a, b) => a[1] - b[1]);

    const clusters = new Map<Point, Set<Point>>();

    let pairsUsed = 0;
    for (const [pair, _dist] of distancePairs) {
      if (pairsUsed >= this.conns) {
        break;
      }

      pairsUsed++;

      const [p1, p2] = pair;
      const c1 = clusters.get(p1);
      const c2 = clusters.get(p2);

      if (c1 && c2) {
        if (c1 === c2) {
          // Both points already in same cluster
          continue;
        }

        // Merge clusters
        for (const p of c2) {
          c1.add(p);
          clusters.set(p, c1);
        }
      } else if (c1) {
        c1.add(p2);
        clusters.set(p2, c1);
      } else if (c2) {
        c2.add(p1);
        clusters.set(p1, c2);
      } else {
        // Create new cluster
        const newCluster = new Set<Point>([p1, p2]);
        clusters.set(p1, newCluster);
        clusters.set(p2, newCluster);
      }
    }

    const uniqueClusters = new Set(clusters.values());
    const clusterSizes = [...uniqueClusters].map((c) => c.size);
    clusterSizes.sort((a, b) => b - a);
    logger.debug(`Formed ${clusterSizes.length} clusters with ${pairsUsed} pairs used.`);
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
