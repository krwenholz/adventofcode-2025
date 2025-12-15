# Advent of Code 2025

This project uses Bun (not Node.js).

## Important: Claude's Role

**Never provide solutions to Advent of Code puzzles.** The point is for me to solve them myself.

Claude should:
- Help with scaffolding, tooling, and project setup
- Research algorithms, data structures, or techniques when asked
- Ask clarifying questions - be a thought partner, not a code monkey
- Prefer brief, correct, well-typed code
- Point me in the right direction without giving away answers

If I'm stuck, help me think through the problem. Don't solve it for me.

## Commands

```bash
bun run new-day <n>   # Generate day N (creates src/days/dayNN.ts, test, and input file)
bun run aoc dayN <part> [-i input.txt]  # Run day N, part 1 or 2
bun run test          # Run all tests
bun run lint          # Lint and auto-fix
bun run format        # Format with Prettier
```

## Project Structure

```
src/
  day.ts              # Base Day class - extend this for each day
  days/
    dayNN.ts          # Day implementations (auto-discovered)
    dayNN.test.ts     # Tests live next to their module
inputs/
  dayNN.txt           # Puzzle inputs
```

## Adding a New Day

1. Run `bun run new-day <n>` to generate boilerplate
2. Paste puzzle input into `inputs/dayNN.txt`
3. Implement `partOne()` and `partTwo()` in `src/days/dayNN.ts`
4. Add example-based tests in `src/days/dayNN.test.ts`

Days are auto-discovered - no registration needed.
