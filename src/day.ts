import { Command } from "commander";

export abstract class Day {
  abstract day: number;
  abstract name: string;

  abstract partOne(input: string): string | number;
  abstract partTwo(input: string): string | number;

  createCommand(): Command {
    const inputDefault = `inputs/day${this.day.toString().padStart(2, "0")}.txt`;

    return new Command(`day${this.day}`)
      .description(`Day ${this.day}: ${this.name}`)
      .argument("<part>", "Which part to run (1 or 2)")
      .option("-i, --input <path>", "Input file path", inputDefault)
      .action(async (part: string, options: { input: string }) => {
        const input = await Bun.file(options.input).text();

        const start = performance.now();
        const result = part === "1" ? this.partOne(input) : this.partTwo(input);
        const elapsed = performance.now() - start;

        console.log(`📅  Day ${this.day}: ${this.name} (Part ${part})`);
        console.log("━".repeat(36));
        console.log(`⏱️  ${elapsed.toFixed(3)} ms`);
        console.log(`🎁  ${result}`);
        console.log();
      });
  }
}
