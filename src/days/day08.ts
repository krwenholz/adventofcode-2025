import { spawnSync } from "bun";
import { Day } from "../day";
import logger from "../logger";

export class Day08 extends Day {
  day = 8;
  name = "TODO: Add puzzle name";

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
     * https://docs.scipy.org/doc/scipy/reference/generated/scipy.cluster.hierarchy.cut_tree.html#scipy.cluster.hierarchy.cut_tree
     */

    let scipyScript = `
from scipy import cluster
from scipy.spatial.distance import pdist
import numpy as np
points = [${_lines.map((line) => "(" + line + ")").join(",")}]
condensed_distance_matrix = pdist(points)
linkage = cluster.hierarchy.ward(condensed_distance_matrix)
cutree = cluster.hierarchy.cut_tree(linkage, n_clusters=[5, 10])
print(cutree)
    `;
    const scriptFileName = `/tmp/day08_scipy_${Bun.hash(scipyScript)}.py`;

    Bun.write(scriptFileName, scipyScript);

    let dockerCmd = `docker run -it --rm -v "$(pwd)":/home/jovyan/work jupyter/scipy-notebook python work/your_script.py`;

    const result = spawnSync(
      [
        "docker",
        "run",
        "--rm",
        "-v",
        `${process.cwd()}:/home/jovyan/work`,
        "jupyter/scipy-notebook",
        "python",
        scriptFileName,
      ],
      {
        stdout: "pipe",
        stderr: "pipe",
      }
    );

    logger.debug(`SciPy stdout: ${result.stdout.toString()}`);
    logger.debug(`SciPy stderr: ${result.stderr.toString()}`);
    logger.debug(`SciPy exit code: ${result.exitCode}`);
    return "Not implemented";
  }

  partTwo(input: string): string {
    const _lines = input.trim().split("\n");
    // TODO: Implement part two
    return "Not implemented";
  }
}
