# Review Examples

Use these to calibrate feedback tone and specificity.

---

## Example 1: Type Safety

### Bad
```ts
const lines: any[] = input.split("\n");
const val = lines[0]![1]!;
```

### Good
```ts
const lines = input.trim().split("\n");
const firstLine = lines[0];
if (!firstLine) return 0;
const val = firstLine[1] ?? "";
```

### Feedback Style
> **Type safety**: `any` loses type checking — `string[]` is correct here. The `!` assertions hide potential undefined access; use explicit checks or `??` instead.

---

## Example 2: Parsing Separation

### Bad
```ts
partOne(input: string): number {
  let total = 0;
  for (const line of input.split("\n")) {
    const [a, b] = line.split(",").map(Number);
    if (a! > b!) total += a! - b!;
  }
  return total;
}
```

### Good
```ts
interface Pair { a: number; b: number }

function parse(input: string): Pair[] {
  return input.trim().split("\n").map(line => {
    const [a, b] = line.split(",").map(Number);
    return { a, b };
  });
}

partOne(input: string): number {
  const pairs = parse(input);
  return pairs
    .filter(({ a, b }) => a > b)
    .reduce((sum, { a, b }) => sum + (a - b), 0);
}
```

### Feedback Style
> **Readability**: Separating parsing from logic makes both easier to test and debug. The `Pair` type documents the data shape and catches typos at compile time.

---

## Example 3: Performance in Loops

### Bad
```ts
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    if (/\d/.test(grid[i]![j]!)) {
      result += Number(grid[i]![j]!);
    }
  }
}
```

### Good
```ts
const isDigit = (ch: string) => ch >= "0" && ch <= "9";

for (let i = 0; i < rows; i++) {
  const row = grid[i];
  if (!row) continue;
  for (let j = 0; j < cols; j++) {
    const ch = row[j];
    if (ch && isDigit(ch)) {
      result += ch.charCodeAt(0) - 48;
    }
  }
}
```

### Feedback Style
> **Performance**: Regex in tight loops adds overhead. A char comparison is faster. Hoisting `grid[i]` avoids repeated lookups.

---

## Example 4: Data Structure Choice

### Bad
```ts
const visited: string[] = [];
// ...
if (!visited.includes(`${x},${y}`)) {
  visited.push(`${x},${y}`);
}
```

### Good
```ts
const visited = new Set<string>();
// ...
const key = `${x},${y}`;
if (!visited.has(key)) {
  visited.add(key);
}
```

### Feedback Style
> **Performance**: `Array.includes()` is O(n); `Set.has()` is O(1). For grid traversal with thousands of cells, this can be a 100x speedup.

---

## Example 5: Tone Calibration

When code is mostly good, be brief:

> **Overall**: Parsing is well-separated and types are solid. A few improvements:
> 1. Line 23: Replace `arr.find() !== undefined` with `arr.some()`
> 2. Line 45: The nested ternary is hard to follow — consider an `if` block

When code needs work, stay matter-of-fact:

> **Overall**: The solution works. Some TypeScript patterns that will help on future days:
> 1. ...

---

## Example 6: Unused Variables

### Bad
```ts
let found = false;
for (const item of items) {
  if (matches(item)) {
    found = true;
    result.push(item);
  }
}
// `found` never used
```

### Feedback Style
> **Cleanup**: `found` is set but never read. Remove it. (`bun run lint` should catch this.)
