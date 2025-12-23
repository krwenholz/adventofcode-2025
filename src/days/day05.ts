import { Day } from "../day";
import logger from "../logger";

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
     */
    const ingredients: Set<number> = new Set();
    let i = _lines.length - 1;
    for (; i >= 0; i--) {
      const ingredientLine = _lines[i]!;
      if (ingredientLine.trim() === "") {
        i--;
        break;
      }
      const ingredient = Number(ingredientLine.trim());
      ingredients.add(ingredient);
    }

    logger.info(`Collected ${ingredients.size} ingredients`);

    let count = 0;
    for (; i >= 0; i--) {
      const line = _lines[i]!;
      const [startStr, endStr] = line.split("-");
      const start = Number(startStr);
      const end = Number(endStr);
      for (let n = start; n <= end; n++) {
        if (ingredients.has(n)) {
          count++;
          ingredients.delete(n); // avoid double counting
        }
      }
    }

    return `${count}`;
  }

  partTwo(input: string): string | number {
    const _lines = input.trim().split("\n");
    // TODO: Implement part two
    return "Not implemented";
  }
}
