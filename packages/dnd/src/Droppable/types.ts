import type { IPointNum } from "@dflex/utils";
import type { INode } from "@dflex/core-instance";

interface InsertionBasic {
  position: IPointNum;
}

export interface InsertionELmMeta1 extends InsertionBasic {
  isOrphan: false;
  elm: INode;
  isRestoredLastPosition: boolean;
  prevElm?: INode;
}

export interface InsertionELmMeta2 extends InsertionBasic {
  isOrphan: true;
  isRestoredLastPosition: true;
  elm: null;
  prevElm?: never;
}

export type InsertionELmMeta = InsertionELmMeta1 | InsertionELmMeta2;
