export type { DFlexLMutationPlugin } from "./DFlexMutations";

export { default as DFlexDirtyLeavesCollector } from "./DFlexDirtyLeavesCollector";

export { default as DFlexIDGarbageCollector } from "./DFlexIDGarbageCollector";
export type { TerminatedDOMiDs } from "./DFlexIDGarbageCollector";

export {
  hasMutationsInProgress,
  addObserver,
  disconnectObservers,
  connectObservers,
} from "./DFlexMutations";
