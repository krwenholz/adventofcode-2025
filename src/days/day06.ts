import { Day } from "../day";
import logger from "../logger";
import { stringify } from "superjson";

export class Day06 extends Day {
  day = 6;
  name = "Trash Compactor";

  partOne(input: string): string | number {
    const _lines = input
      .trim()
      .split("\n")
      .map((line) => {
        if (line[0] === "*" || line[0] === "+") return line.trim().split(/\s+/);
        return line.trim().split(/\s+/).map(Number);
      });
    const totalRows = _lines.length;
    const totalCols = _lines[0]!.length;

    let total = 0;
    for (let col = 0; col < totalCols; col++) {
      const operator = _lines[totalRows - 1]![col];
      let acc = operator === "*" ? 1 : 0;
      for (let row = 0; row < totalRows - 1; row++) {
        switch (operator) {
          case "*":
            acc *= Number(_lines[row]![col]);
            break;
          case "+":
            acc += Number(_lines[row]![col]);
            break;
        }
      }
      logger.debug(`Column ${col} (${operator}): ${acc}`);
      total += acc;
    }
    return `${total}`;
  }

  partTwo(input: string): string | number {
    const _lines = input.split("\n");
    const totalRows = _lines.length;
    const totalCols = _lines[0]!.length;

    let done = false;
    let results: number[] = [];
    let problemNums: number[] = [];
    for (let col = totalCols - 1; col >= 0; col--) {
      let curNum = 0;
      for (let row = 0; row < totalRows; row++) {
        const char = _lines[row]![col]!;
        if (char === " " || char === undefined) {
          if (curNum != 0) {
            problemNums.push(curNum);
            curNum = 0;
          }
          continue;
        }

        if (/\d/.test(char)) {
          curNum = curNum * 10 + Number(char);
          continue;
        }

        logger.debug(
          `At row ${row}, col ${col}: char='${char}', curNum=${curNum}, problemNums=${stringify(problemNums)}`
        );
        if (char === "*") {
          done = true;
          results.push(problemNums.reduce((acc, n) => acc * n, curNum || 1));
        } else if (char === "+") {
          done = true;
          results.push(problemNums.reduce((acc, n) => acc + n, curNum));
        }
        curNum = 0;
        problemNums = [];
      }
    }

    logger.debug(`Results: ${stringify(results)}`);
    return `${results.reduce((acc, n) => acc + n, 0)}`;
  }
}
