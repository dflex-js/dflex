import type {
  Dimensions,
  RectDimensions,
  ITracker,
  IPointNum,
} from "@dflex/utils";
import type { IDFlexContainer, IDFlexNode } from "@dflex/core-instance";

import type { RegisterInputOpts, IDFlexBaseStore } from "@dflex/store";
import type { DraggedEvent, LayoutState } from "../types";

export type ELmKey = string;

export interface ElmTree {
  element: IDFlexNode;
  parent: IDFlexNode | null;
  branches: {
    siblings: string[];
    parents: string[];
  };
}

export interface ScrollThreshold {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
}

interface Translate {
  translateX: number;
  translateY: number;
}

export type InsertionELmMeta = {
  isRestoredLastPosition: boolean;
  position: IPointNum;
  isEmpty: boolean;
  isOrphan: boolean;
  elm: IDFlexNode | null;
  prevElm: IDFlexNode | null;
};

export interface IDFlexDnDStore extends IDFlexBaseStore {
  readonly containers: Map<string, IDFlexContainer>;
  readonly unifiedContainerDimensions: {
    [depth: number]: Dimensions;
  };
  readonly tracker: ITracker;
  readonly layoutState: LayoutState;
  observer: MutationObserver | null;
  initSiblingContainer(SK: string, shouldValidate: boolean): void;
  updateBranchVisibility(SK: string, shouldCheckVisibility: boolean): void;
  handleElmMigration(
    SK: string,
    originSK: string,
    appendOffset: RectDimensions
  ): void;
  getInsertionELmMeta(insertAt: number, SK: string): InsertionELmMeta;
  onStateChange(state: LayoutState): void;
  emitEvent(event: DraggedEvent): void;
  register(element: RegisterInputOpts): void;
  getELmTranslateById(id: string): Translate;
  getElmTreeById(id: string): ElmTree;
  getElmSiblingsById(id: string): string[] | null;
  destroy(): void;
}
