import { CoreInstanceInterface } from "packages/coreInstance/src/types";
import { ELmBranch } from "packages/dom-gen/src/types";

export interface ElmTree {
  element: CoreInstanceInterface;
  parent: CoreInstanceInterface | null;
  branches: {
    siblings: ELmBranch;
    parents: ELmBranch;
  };
}
