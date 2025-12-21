import { Day } from "../day";
import logger from "../logger";

type ID = {
  len: number;
  val: number;
};

type Range = {
  start: string;
  end: string;
};

const SYMMETRIES = new Map<string, boolean>();

function isSymmetric(id: string): boolean {
  if (SYMMETRIES.has(id)) {
    return SYMMETRIES.get(id)!;
  }

  if (id.length % 2 != 0) {
    SYMMETRIES.set(id, false);
    return false;
  }

  const half = id.length / 2;
  for (let i = 0; i < half; i++) {
    if (id[i] != id[half + i]) {
      SYMMETRIES.set(id, false);
      return false;
    }
  }

  SYMMETRIES.set(id, true);
  return true;
}

const REPEATS = new Map<string, boolean>();

function hasNLongRepeatableParts(id: string, n: number): boolean {
  const parts = new Set<string>();
  for (let i = 0; i < id.length; i += n) {
    const part = id.substring(i, i + n);
    parts.add(part);
    if (parts.size > 1) {
      return false;
    }
  }
  logger.debug(`Found repeat of length ${n} in ${id}`);
  return true;
}

function hasAtLeastTwoRepeats(id: string): boolean {
  logger.debug(`Checking repeats for ${id}`);
  if (REPEATS.has(id)) {
    return REPEATS.get(id)!;
  }

  const half = id.length / 2;
  for (let n = 1; n <= half; n++) {
    if (hasNLongRepeatableParts(id, n)) {
      REPEATS.set(id, true);
      return true;
    }
  }

  REPEATS.set(id, false);
  return false;
}

export class Day02 extends Day {
  day = 2;
  name = "Gift Shop";

  /**
   * We need to find symmetric IDs in the range and sum them.
   * Use the start and end as both numbers and strings, avoid swapping back and forth with types.
   * Everything is a str until the end. And memoize whether a number is symmetric or not.
   */
  partOne(input: string): string | number {
    const rangeStrs = input.trim().split(",");
    const ranges: Range[] = [];
    for (const r of rangeStrs) {
      const rMatch = r.match(/(\d+)-(\d+)/);
      if (rMatch) {
        var [_, start, end] = rMatch;
        start = start || "";
        end = end || "";
        ranges.push({
          start,
          end,
        });
      } else {
        throw new Error(`Unmatched ${r}`);
      }
    }

    return (
      "" +
      ranges
        .map((r) => {
          var invalidSum = 0;
          for (let val = Number(r.start); val <= Number(r.end); val++) {
            invalidSum += isSymmetric(val.toString()) ? val : 0;
          }
          return invalidSum;
        })
        .reduce((p, c, _) => p + c)
    );
  }

  partTwo(input: string): string | number {
    const rangeStrs = input.trim().split(",");
    const ranges: Range[] = [];
    for (const r of rangeStrs) {
      const rMatch = r.match(/(\d+)-(\d+)/);
      if (rMatch) {
        var [_, start, end] = rMatch;
        start = start || "";
        end = end || "";
        ranges.push({
          start,
          end,
        });
      } else {
        throw new Error(`Unmatched ${r}`);
      }
    }

    return (
      "" +
      ranges
        .map((r) => {
          var invalidSum = 0;
          for (let val = Number(r.start); val <= Number(r.end); val++) {
            invalidSum += hasAtLeastTwoRepeats(val.toString()) ? val : 0;
          }
          return invalidSum;
        })
        .reduce((p, c, _) => p + c)
    );
  }
}
