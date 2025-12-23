/**
 * Courtesy of Educative.io
 * https://www.educative.io/blog/data-structures-tutorial-advanced
 */
export class SegmentTree {
  private n: number;
  private tree: number[];

  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.build(arr, 0, 0, this.n - 1);
  }

  private build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = arr[start]!;
    } else {
      const mid = Math.floor((start + end) / 2);
      this.build(arr, 2 * node + 1, start, mid);
      this.build(arr, 2 * node + 2, mid + 1, end);
      this.tree[node] = this.tree[2 * node + 1]! + this.tree[2 * node + 2]!;
    }
  }

  private query(node: number, start: number, end: number, L: number, R: number): number {
    if (start > R || end < L) return 0;
    if (start >= L && end <= R) return this.tree[node]!;

    const mid = Math.floor((start + end) / 2);
    return (
      this.query(2 * node + 1, start, mid, L, R) + this.query(2 * node + 2, mid + 1, end, L, R)
    );
  }

  private update(node: number, start: number, end: number, idx: number, newValue: number): void {
    if (start === end) {
      this.tree[node] = newValue;
    } else {
      const mid = Math.floor((start + end) / 2);
      if (idx <= mid) {
        this.update(2 * node + 1, start, mid, idx, newValue);
      } else {
        this.update(2 * node + 2, mid + 1, end, idx, newValue);
      }
      this.tree[node] = this.tree[2 * node + 1]! + this.tree[2 * node + 2]!;
    }
  }

  rangeSum(L: number, R: number): number {
    return this.query(0, 0, this.n - 1, L, R);
  }

  modify(idx: number, newValue: number): void {
    this.update(0, 0, this.n - 1, idx, newValue);
  }
}
