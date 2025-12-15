import { Glob } from "bun";
import { Day } from "../day";

const glob = new Glob("day*.ts");
const daysDir = import.meta.dir;

export const days: Day[] = [];

for await (const file of glob.scan(daysDir)) {
  const module = await import(`./${file}`);
  // Find the exported Day class (e.g., Day01, Day02, etc.)
  const DayClass = Object.values(module).find(
    (exp): exp is new () => Day =>
      typeof exp === "function" &&
      exp.prototype instanceof Day
  );
  if (DayClass) {
    days.push(new DayClass());
  }
}

// Sort by day number
days.sort((a, b) => a.day - b.day);
