import { spawnSync } from "bun";
import { Day } from "../day";
import logger from "../logger";

export class Day08 extends Day {
  day = 8;
  name = "Playground";
  conns = 1000;

  partOne(input: string): string {
    const _lines = input.trim().split("\n");
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
     * 2. Heapsort this shit
     * 3  Pull correct number of pairs to form clusters
     * Lame, but effective
     */

    let scipyScript = `
from scipy import cluster
from scipy.spatial.distance import pdist
import numpy as np
import sys
import json
points = [${_lines.map((line) => "(" + line + ")").join(",")}]
condensed_distance_matrix = pdist(points)
linkage = cluster.hierarchy.ward(condensed_distance_matrix)
cutree = cluster.hierarchy.cut_tree(linkage)
print("Linkage matrix:")
print(linkage)
print("Cut tree:")
print(cutree)
sys.stderr.write(json.dumps(cutree.tolist()))
    `;
    const scriptFileName = `tmp/day08_scipy_${Bun.hash(scipyScript)}.py`;

    Bun.write(scriptFileName, scipyScript);

    const { stdout, stderr, exitCode } = spawnSync(
      [
        "docker",
        "run",
        "--rm",
        "-v",
        `${process.cwd()}:/home/jovyan/`,
        "jupyter/scipy-notebook",
        "python",
        scriptFileName,
      ],
      {
        stdout: "pipe",
        stderr: "pipe",
      }
    );

    logger.debug(`SciPy stdout: ${stdout.toString()}`);
    logger.debug(`SciPy stderr: ${stderr.toString()}`);
    logger.debug(`SciPy exit code: ${exitCode}`);

    const cutree: number[][] = JSON.parse(stderr.toString());

    const ress = new Array<number>();
    for (let c = 0; c < cutree.length; c++) {
      const cut = cutree[c]!;
      const clusters = new Map<number, number>();
      cut.forEach((clusterId) => {
        clusters.set(clusterId, (clusters.get(clusterId) ?? 0) + 1);
      });

      const sizes = new Array<number>();
      clusters.forEach((size) => {
        sizes.push(size);
      });
      sizes.sort((a, b) => b - a);
      ress.push(sizes.slice(0, 2).reduce((a, b) => a * b, 1));
      logger.debug(
        `Cut ${c}: ${clusters.size} clusters (${sizes.join(", ")}) with product ${ress[c]}`
      );
    }
    return "" + ress[this.conns - 1];
  }

  partTwo(input: string): string {
    const _lines = input.trim().split("\n");
    // TODO: Implement part two
    return "Not implemented";
  }
}
