import { Day } from "../day";

const PAPER = "@";

interface Cell {
  row: number;
  col: number;
}

class CellSet {
  private data = new Set<number>();

  constructor(private width: number) {}

  private toKey(cell: Cell): number {
    return cell.row * this.width + cell.col;
  }

  private fromKey(key: number): Cell {
    return { row: Math.floor(key / this.width), col: key % this.width };
  }

  add(cell: Cell): void {
    this.data.add(this.toKey(cell));
  }

  delete(cell: Cell): void {
    this.data.delete(this.toKey(cell));
  }

  has(cell: Cell): boolean {
    return this.data.has(this.toKey(cell));
  }

  get size(): number {
    return this.data.size;
  }

  first(): Cell | undefined {
    const key = this.data.values().next().value;
    if (key === undefined) return undefined;
    return this.fromKey(key);
  }
}

class CellMap<T> {
  private data = new Map<number, T>();

  constructor(private width: number) {}

  private toKey(cell: Cell): number {
    return cell.row * this.width + cell.col;
  }

  set(cell: Cell, value: T): void {
    this.data.set(this.toKey(cell), value);
  }

  get(cell: Cell): T | undefined {
    return this.data.get(this.toKey(cell));
  }

  delete(cell: Cell): void {
    this.data.delete(this.toKey(cell));
  }

  has(cell: Cell): boolean {
    return this.data.has(this.toKey(cell));
  }
}

function countAdjacentPaper(grid: string[][], row: number, col: number): number {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue;
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[r]!.length) {
        if (grid[r]![c]! === PAPER) {
          count++;
        }
      }
    }
  }
  return count;
}

function getAdjacentPaperCells(grid: string[][], cell: Cell): Cell[] {
  const cells: Cell[] = [];
  for (let r = cell.row - 1; r <= cell.row + 1; r++) {
    for (let c = cell.col - 1; c <= cell.col + 1; c++) {
      if (r === cell.row && c === cell.col) continue;
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[r]!.length) {
        if (grid[r]![c]! === PAPER) {
          cells.push({ row: r, col: c });
        }
      }
    }
  }
  return cells;
}

export class Day04 extends Day {
  day = 4;
  name = "Printing Department";

  partOne(input: string): string | number {
    const _lines = input.trim().split("\n");
    /**
     * '@' represents a roll of paper
     * it is accessible if it is adjacent to fewer than 4 rolls of paper (in the 8 spaces around it)
     */
    const grid: string[][] = _lines.map((line) => line.split(""));
    let accessibleCount = 0;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r]!.length; c++) {
        if (grid[r]![c]! === PAPER) {
          if (countAdjacentPaper(grid, r, c) < 4) {
            accessibleCount++;
          }
        }
      }
    }
    return `${accessibleCount}`;
  }

  partTwo(input: string): string | number {
    const _lines = input.trim().split("\n");
    const grid: string[][] = _lines.map((line) => line.split(""));

    const width = grid[0]!.length;
    const cellToAdjacencyCount = new CellMap<number>(width);
    const adjacencyCountToCells: CellSet[] = new Array(9).fill(0).map(() => new CellSet(width));

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r]!.length; c++) {
        if (grid[r]![c]! === PAPER) {
          const cell: Cell = { row: r, col: c };
          const adjCount = countAdjacentPaper(grid, r, c);
          cellToAdjacencyCount.set(cell, adjCount);
          adjacencyCountToCells[adjCount]!.add(cell);
        }
      }
    }

    let accessibleCount = 0;
    let eligibleAdjacencyCount = adjacencyCountToCells.findIndex((val, idx) => val.size > 0 && idx < 4);

    while (eligibleAdjacencyCount !== -1) {
      while (adjacencyCountToCells[eligibleAdjacencyCount!]!.size > 0) {
        const cell = adjacencyCountToCells[eligibleAdjacencyCount!]!.first()!;
        adjacencyCountToCells[eligibleAdjacencyCount!]!.delete(cell);
        cellToAdjacencyCount.delete(cell);

        grid[cell.row]![cell.col]! = ".";

        const adjacentCells = getAdjacentPaperCells(grid, cell);
        for (const adjacentCell of adjacentCells) {
          const currentAdjCount = cellToAdjacencyCount.get(adjacentCell)!;
          adjacencyCountToCells[currentAdjCount]!.delete(adjacentCell);
          const newAdjCount = currentAdjCount - 1;
          cellToAdjacencyCount.set(adjacentCell, newAdjCount);
          adjacencyCountToCells[newAdjCount]!.add(adjacentCell);
        }
        accessibleCount++;
      }
      eligibleAdjacencyCount = adjacencyCountToCells.findIndex((val, idx) => val.size > 0 && idx < 4);
    }

    return `${accessibleCount}`;
  }
}
