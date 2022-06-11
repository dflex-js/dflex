// https://github.com/microsoft/TypeScript/issues/28374#issuecomment-536521051
type DeepNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export type RegisterInputOpts = {
  /** Targeted element-id. */
  id: string;
  /** Parent element-id. Pass empty string if there's none. */
  parentID: string;
  /** The depth of targeted element starting from zero (The default value is zero).  */
  depth?: number;
  /**
   * True for elements that won't be transformed during DnD but belongs to the
   * same interactive container.
   * */
  readonly?: boolean;
};

export type RegisterInputBase = DeepNonNullable<RegisterInputOpts> & {
  isInitialized: boolean;
  isPaused: boolean;
  scrollX: number;
  scrollY: number;
};

export interface IDFlexBaseStore {
  register(element: RegisterInputBase): void;
  unregister(id: string): void;
  destroy(): void;
  getElmBranchByKey(siblingsKy: string): string[];
}
