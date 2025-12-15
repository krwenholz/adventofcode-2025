import { Command } from "commander";

export abstract class Day {
  abstract day: number;
  abstract name: string;

  abstract partOne(input: string): string | number;
  abstract partTwo(input: string): string | number;

  async readInput(inputPath: string): Promise<string> {
    const file = Bun.file(inputPath);
    return await file.text();
  }

  defaultInputPath(): string {
    return `inputs/day${this.day.toString().padStart(2, "0")}.txt`;
  }

  createCommand(): Command {
    const cmd = new Command(`day${this.day}`)
      .description(`Day ${this.day}: ${this.name}`)
      .argument("<part>", "Which part to run (1 or 2)")
      .option("-i, --input <path>", "Input file path", this.defaultInputPath())
      .action(async (part: string, options: { input: string }) => {
        const input = await this.readInput(options.input);

        const result = part === "1"
          ? this.partOne(input)
          : this.partTwo(input);

        console.log(`Day ${this.day} Part ${part}: ${result}`);
      });

    this.extendCommand(cmd);
    return cmd;
  }

  /** Override this method to add custom options/arguments to the command */
  extendCommand(_cmd: Command): void {
    // Default: no additional options
  }
}
