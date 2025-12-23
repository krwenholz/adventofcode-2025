import { Day } from "../day";

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
     */
    const freshIngredients: Set<number> = new Set();
    let i = 0;
    for (; i < _lines.length; i++) {
      const line = _lines[i]!;
      if (line.trim() === "") {
        i++;
        break;
      }
      const [startStr, endStr] = line.split("-");
      const start = Number(startStr);
      const end = Number(endStr);
      for (let n = start; n <= end; n++) {
        freshIngredients.add(n);
      }
    }

    let count = 0;
    for (; i < _lines.length; i++) {
      const ingredientLine = _lines[i]!;
      const ingredient = Number(ingredientLine.trim());
      if (freshIngredients.has(ingredient)) {
        count++;
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
