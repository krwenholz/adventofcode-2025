import { Day } from "../day";

export class Day01 extends Day {
  day = 1;
  name = "TODO: Add puzzle name";

  partOne(input: string): string | number {
    const _lines = input.trim().split("\n");
    var zeroes = 0;
    var cur = 50;
    _lines.forEach((l) => {
      // A left turn is just 100 - AMT
      const offset = l[0] == "R" ? 0 : 100;
      const val = l.slice(1);
      cur = (cur + Math.abs(offset - (Number(val) % 100))) % 100;
      if (cur == 0) {
        zeroes++;
      }
    });
    return String(zeroes);
  }

  partTwo(input: string): string | number {
    const _lines = input.trim().split("\n");
    var zeroes = 0;
    var cur = 50;
    _lines.forEach((l) => {
      const direction = l[0] == "R" ? 1 : -1;
      const val = l.slice(1);
      for (var i = 0; i < Number(val); i++) {
        cur = (cur + direction) % 100;
        if (cur == 0) {
          zeroes++;
        }
      }
    });
    return String(zeroes);
  }
}
