import { Day } from "../day";
import superjson from "superjson";
import logger from "../logger";

const PAPER = "@";

function countAdjacentPaper(grid: string[][], row: number, col: number): number {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue; // Skip the center cell
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[r]!.length) {
        if (grid[r]![c]! === PAPER) {
          count++;
        }
      }
    }
  }
  return count;
}

function serializeCell(row: number, col: number): string {
  return `<${row}-${col}>`;
}

function deserializeCell(cell: string): [number, number] {
  const parts = cell.slice(1, -1).split("-");
  return [Number(parts[0]!), Number(parts[1]!)];
}

function getAdjacentPaperCells(grid: string[][], cell: string): string[] {
  const poss = deserializeCell(cell);
  const rowStr = poss[0]!;
  const colStr = poss[1]!;
  const cellsWithPaper: string[] = [];
  for (let r = rowStr - 1; r <= rowStr + 1; r++) {
    for (let c = colStr - 1; c <= colStr + 1; c++) {
      if (r === rowStr && c === colStr) continue; // Skip the center cell
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[r]!.length) {
        if (grid[r]![c]! === PAPER) {
          cellsWithPaper.push(serializeCell(r, c));
        }
      }
    }
  }
  return cellsWithPaper;
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
    /**
     * Now we get to make successive passes removing rolls of paper.
     * This could be super expensive to make many passes each time we remove rolls.
     * So let's be smarter!
     * I don't think we even need the grid. What we need is cells mapped to their count of adjacent rolls.
     * And the reverse. So let's build two structures.
     * - A map of cell => count of adjacent rolls
     * - A map of count of adjacent rolls => set of cells
     * Then we pass through removing rolls from the lowest count of adjacent rolls to the highest.
     */
    const grid: string[][] = _lines.map((line) => line.split(""));
    const cellToAdjacencyCount: Map<string, number> = new Map();
    const adjacencyCountToCells: Set<string>[] = new Array(9).fill(0).map(() => new Set<string>());

    // Initialize our two data structures.
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r]!.length; c++) {
        if (grid[r]![c]! === PAPER) {
          const cellKey = serializeCell(r, c);
          const adjCount = countAdjacentPaper(grid, r, c);
          cellToAdjacencyCount.set(cellKey, adjCount);
          adjacencyCountToCells[adjCount]!.add(cellKey);
        }
      }
    }

    let accessibleCount = 0;
    let eligibleAdjacencyCount = adjacencyCountToCells.findIndex((val, idx) => {
      // Find an adjacency count that has cells and is less than 4
      // These cells can be visited, and removed.
      return val.size > 0 && idx < 4;
    });
    while (eligibleAdjacencyCount !== -1) {
      while (adjacencyCountToCells[eligibleAdjacencyCount!]!.size > 0) {
        const cellKey = adjacencyCountToCells[eligibleAdjacencyCount!]!.values().next().value!;
        adjacencyCountToCells[eligibleAdjacencyCount!]!.delete(cellKey);
        cellToAdjacencyCount.delete(cellKey);
        const [row, col] = deserializeCell(cellKey);
        grid[row]![col]! = "."; // Remove the paper from the grid
        // Then update all adjacent cells to this one.
        const adjacentCells = getAdjacentPaperCells(grid, cellKey);
        for (const adjacentCell of adjacentCells) {
          const currentAdjCount = cellToAdjacencyCount.get(adjacentCell)!;
          // Remove from current adjacency set
          adjacencyCountToCells[currentAdjCount]!.delete(adjacentCell);
          // Decrement count
          const newAdjCount = currentAdjCount - 1;
          cellToAdjacencyCount.set(adjacentCell, newAdjCount);
          // Add to new adjacency set
          adjacencyCountToCells[newAdjCount]!.add(adjacentCell);
        }
        accessibleCount++;
      }
      eligibleAdjacencyCount = adjacencyCountToCells.findIndex((val, idx) => {
        // Find an adjacency count that has cells and is less than 4
        // These cells can be visited, and removed.
        return val.size > 0 && idx < 4;
      });
    }

    return `${accessibleCount}`;
  }
}
