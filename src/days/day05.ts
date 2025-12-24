import { Day } from "../day";
import IntervalTree from "@flatten-js/interval-tree";
import logger from "../logger";
import { stringify } from "superjson";

export class Day05 extends Day {
  day = 5;
  name = "Cafeteria";

  partOne(input: string): string | number {
    const _lines = input.trim().split("\n");
    /**
     * First set of lines is ranges, then they're all ingredients.
     * I need to show which ingredients fall in _a_ range. Even if they overlap.
     * So what's the most compact representation of a range of numbers?
     *
     * Let's start with a naive implementation that expands the ranges into entries in a set.
     * The Number call will be kinda expensive, but meh.
     * - lol OOM on the full input
     *
     * I still like my implementation, but what if we did it in reverse? We could collect the ingredients in a set then iterate over ranges?
     * We'll duplicate work on overlapping ranges, but we won't OOM.
     * - never finishes!
     *
     * I think expanding and traversing the ranges is too much.
     * Instead, let's build an interesting structure! A binary search tree seems kind of right?
     * I did some research and this is called a range tree (segment tree and Fenwick tree are similar).
     * I don't want to implement one myself.
     *
     * Okay new thing. I learned about [interval trees](https://en.wikipedia.org/wiki/Interval_tree).
     * There's a node lib for this (for graphics!) that should help me make faster queries. I'm not sure
     * if I can define an interval of size one, but we'll try it out.
     */
    const breakIdx = _lines.findIndex((line) => {
      if (line.trim() === "") {
        return true;
      }
    });
    const freshRanges: Array<[number, number]> = _lines.slice(0, breakIdx).map((line) => {
      const range = line.split("-").map((n) => Number(n.trim()));
      return [range[0]!, range[1]!];
    });
    const freshTree = new IntervalTree<string>();
    freshRanges.forEach(([start, end], i) => {
      freshTree.insert([start, end], `range-${start}-${end}`);
    });

    return (
      "" +
      _lines.slice(breakIdx + 1).reduce((count, line) => {
        const ingredient = Number(line.trim());
        //const results = freshTree.search([ingredient, ingredient]);
        //if (results.length > 0) {
        //  return count + 1;
        //}
        //return count;
        // intersect_any is about 1/2 ms faster than search on my full puzzle input (at about 2.5ms total 😅)
        return count + (freshTree.intersect_any([ingredient, ingredient]) ? 1 : 0);
      }, 0)
    );
  }

  partTwo(input: string): string | number {
    const _lines = input.trim().split("\n");
    // So now we just have to expand the ranges and count the totals.
    // We'll OOM, as before if we do that, but what if we use our interval tree?
    // Before insertion we can check for any ranges with overlap and reduce the size of the one we're about to insert?
    // Then only insert non-overlapping ranges, and finally count the total size of ranges in the tree.
    const breakIdx = _lines.findIndex((line) => {
      if (line.trim() === "") {
        return true;
      }
    });
    const freshRanges: Array<[number, number]> = _lines.slice(0, breakIdx).map((line) => {
      const range = line.split("-").map((n) => Number(n.trim()));
      return [range[0]!, range[1]!];
    });
    freshRanges.sort((a, b) => a[0] - b[0]);

    let totalRange = 0;
    let curRange: [number, number] | null = null;
    logger.debug(`Sorted ranges: ${stringify(freshRanges)}`);
    for (let i = 0; i < freshRanges.length; i++) {
      const [start, end] = freshRanges[i]!;
      // if we have an active range, see if we overlap
      // if we do, extend the active range and continue
      // otherwise, add the active range to total and start a new one
      if (curRange) {
        if (start <= curRange[1]) {
          // overlap
          if (end > curRange[1]) {
            // extend
            curRange[1] = end;
          }
          continue;
        }

        // no overlap, add current range to total
        totalRange += curRange[1] - curRange[0] + 1;
        curRange = null;
      }
      curRange = [start, end];
    }
    totalRange += curRange![1] - curRange![0] + 1;

    return "" + totalRange;
  }
}
