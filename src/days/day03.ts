import { Day } from "../day";
import logger from "../logger";

function batteryValue(line: string, size: number): number {
  const positions = line
    .slice(line.length - size, line.length)
    .split("")
    .map((c) => parseInt(c));
  for (let i = line.length - (size + 1); i >= 0; i--) {
    let currentDigit = parseInt(line[i]!);
    // Now shift positions over if necessary
    for (let j = 0; j < positions.length; j++) {
      if (positions[j]! <= currentDigit) {
        const temp = positions[j]!;
        positions[j] = currentDigit;
        currentDigit = temp;
      } else {
        break;
      }
    }
  }
  const val = parseInt(positions.map((n) => n.toString()).join(""));
  logger.debug(`Line: ${line} Value: ${val}`);
  return val;
}

export class Day03 extends Day {
  day = 3;
  name = "Lobby";

  partOne(input: string): string | number {
    const _lines = input.trim().split("\n");
    // on each line, I want to find the battery with the highest value
    // this is done like a selection sort of picking a max left value then a max value right of that
    // I can exit early if the tens spot of one found so far is higher than the current val
    let total = 0;
    for (const line of _lines) {
      let highVal = -1;
      let highLeft = -1;
      for (let left = 0; left < line.length; left++) {
        const leftVal = parseInt(line[left]!);
        if (highLeft >= leftVal) {
          continue;
        }
        for (let right = left + 1; right < line.length; right++) {
          const newVal = leftVal * 10 + parseInt(line[right]!);
          if (newVal > highVal) {
            highLeft = leftVal;
            highVal = newVal;
          }
        }
      }
      logger.debug(`Line: ${line} Highs: ${highLeft}`);
      total += highVal;
    }
    return `${total}`;
  }

  partTwo(input: string): string | number {
    const _lines = input.trim().split("\n");
    // What if I walk from the right?
    // The first 12 digits are _a_ solution.
    // Then for each step, can I move my leftmost to a better digit?
    // If not, proceed.
    // If so, cool! Move it.
    // Then check each other position to my right to see if it would be better off in my last spot or not.
    let total = 0;
    for (const line of _lines) {
      const val = batteryValue(line, 12);
      total += val;
    }
    return `${total}`;
  }
}
