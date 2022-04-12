export interface IDepth {
  add(SK: string, depth: number): void;
  getByDepth(depth: number): string[];
  removeByDepth(depth: number): void;
  removeAll(): void;
}
