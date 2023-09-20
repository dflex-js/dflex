export type { DFlexLMutationPlugin } from "./DFlexMutations";

export { default as DFlexDirtyLeavesCollector } from "./DFlexDirtyLeavesCollector";

export {
  DFlexIDGarbageCollector,
  hasGCInProgress,
} from "./DFlexIDGarbageCollector";

export type { TerminatedDOMiDs } from "./DFlexIDGarbageCollector";

export {
  hasMutationsInProgress,
  addObserver,
  disconnectObservers,
  connectObservers,
} from "./DFlexMutations";
