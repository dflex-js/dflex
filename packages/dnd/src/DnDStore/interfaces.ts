import { CoreInstanceInterface } from "@dflex/core-instance/src/interfaces";
import { ELmBranch } from "@dflex/dom-gen/src/interfaces";

export interface ElmTree {
  element: CoreInstanceInterface;
  parent: CoreInstanceInterface | null;
  branches: {
    siblings: ELmBranch;
    parents: ELmBranch;
  };
}
