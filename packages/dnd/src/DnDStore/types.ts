import type { CoreInstanceInterface } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";

export interface ElmTree {
  element: CoreInstanceInterface;
  parent: CoreInstanceInterface | null;
  branches: {
    siblings: ELmBranch;
    parents: ELmBranch;
  };
}
