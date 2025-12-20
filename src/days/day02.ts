import { Day } from "../day";

type ID = {
  len: number;
  val: number;
};

type Range = {
  start: ID;
  end: ID;
};

function isSymmetric(id: ID): bool {
  return false;
}

export class Day02 extends Day {
  day = 2;
  name = "TODO: Add puzzle name";

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
          start: { len: start.length, val: Number(start) },
          end: { len: end.length, val: Number(end) },
        });
      } else {
        throw new Error(`Unmatched ${r}`);
      }
    }

    const filtered = ranges.filter((r) => isSymmetric(r.start) && isSymmetric(r.end));

    ranges.map((r) => console.log(r));
    return "Not implemented";
  }

  partTwo(input: string): string | number {
    const _lines = input.trim().split("\n");
    // TODO: Implement part two
    return "Not implemented";
  }
}
