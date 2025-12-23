import { describe, expect, it } from "bun:test";
import { SegmentTree } from "./segment_tree";

describe("SegmentTree", () => {
  it("computes range sum", () => {
    const tree = new SegmentTree([1, 3, 5, 7, 9, 11]);
    expect(tree.rangeSum(1, 4)).toBe(24);
  });

  it("updates value and recomputes range sum", () => {
    const tree = new SegmentTree([1, 3, 5, 7, 9, 11]);
    tree.modify(2, 6);
    expect(tree.rangeSum(1, 4)).toBe(25);
  });
});
