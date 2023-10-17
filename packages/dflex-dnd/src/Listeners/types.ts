import { LayoutStates, MutationStates } from "./constants";

export type LayoutState = (typeof LayoutStates)[keyof typeof LayoutStates];

export type MutationState =
  (typeof MutationStates)[keyof typeof MutationStates];
