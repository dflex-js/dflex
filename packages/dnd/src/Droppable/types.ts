import type { IPointNum } from "@dflex/utils";
import type { INode } from "@dflex/core-instance";

export type InsertionELmMeta = {
  isRestoredLastPosition: boolean;
  position: IPointNum;
  isEmpty: boolean;
  isOrphan: boolean;
  elm: INode | null;
  prevElm: INode | null;
};
