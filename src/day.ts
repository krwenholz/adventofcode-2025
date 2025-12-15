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
        const result = part === "1" ? this.partOne(input) : this.partTwo(input);
        console.log(`Day ${this.day} Part ${part}: ${result}`);
      });
  }
}
