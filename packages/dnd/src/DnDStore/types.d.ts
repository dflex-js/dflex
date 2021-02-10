import { CoreInstance } from "packages/coreInstance/src/types";

export interface ElmTree {
  element: CoreInstance;
  parent: CoreInstance | null;
  branches: {
    siblings: string | string[];
    parents: string | string[];
  };
}
