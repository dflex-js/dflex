export interface IDepth {
  /** Grouping containers in the same level. */
  readonly containers: {
    [depth: number]: string[];
  };
  add(SK: string, depth: number): void;
  getByDepth(depth: number): string[];
  removeByDepth(depth: number): void;
  removeAll(): void;
}
