/* eslint-disable no-unused-vars */
import type { CoreInstanceInterface, Offset } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type { ElmInstance } from "@dflex/store";
import Tracker from "./Tracker";

export interface BoundariesOffset {
  height: number;
  width: number;
  left: number;
  maxTop: number;
  minTop: number;
}

export interface ElmTree {
  element: CoreInstanceInterface;
  parent: CoreInstanceInterface | null;
  branches: {
    siblings: ELmBranch;
    parents: ELmBranch;
  };
}

export interface DnDStoreInterface {
  reattachElmRef(id: string, elmRef: HTMLElement): void;
  register(element: ElmInstance): void;
  getELmOffsetById(id: string): Offset;
  getELmTranslateById(
    id: string
  ): {
    translateX: number;
    translateY: number;
  };
  getElmTreeById(id: string): ElmTree;
}
