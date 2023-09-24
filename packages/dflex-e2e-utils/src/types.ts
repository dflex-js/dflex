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

type Containers = Map<string, DFlexParentContainer>;

type Scrolls = Map<string, DFlexScrollContainer>;

export type { DOMGenKeysType, Containers, Scrolls };
