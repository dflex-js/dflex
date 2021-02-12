import { CoreInstanceInterface } from "@dflex/core-instance/src/pkgTypes";
import { ELmBranch } from "@dflex/dom-gen/src/pkgTypes";

export interface ElmTree {
  element: CoreInstanceInterface;
  parent: CoreInstanceInterface | null;
  branches: {
    siblings: ELmBranch;
    parents: ELmBranch;
  };
}
