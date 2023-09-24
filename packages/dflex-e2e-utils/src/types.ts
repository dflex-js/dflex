import type {
  DFlexParentContainer,
  DFlexScrollContainer,
} from "@dflex/core-instance";

interface DOMGenKeysType {
  idsBySk: {
    [key: string]: string[];
  };
  branchesRegistry: {
    [key: string]: {
      [depth: string]: {
        ids: string[];
        SK: string;
      };
    };
  };
  SKByDepth: {
    [key: string]: string[];
  };
}

interface StorE2EType {
  containers: {
    [k: string]: DFlexParentContainer;
  };
  scrolls: {
    [k: string]: DFlexScrollContainer;
  };
  mutationObserverMap: {
    [k: string]: MutationObserver | null;
  };
}

export type { DOMGenKeysType, StorE2EType };
