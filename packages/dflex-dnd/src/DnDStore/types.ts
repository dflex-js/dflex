import type {
  Dimensions,
  RectDimensions,
  ITracker,
  IPointNum,
} from "@dflex/utils";
import type { IDFlexContainer, IDFlexNode } from "@dflex/core-instance";
import type { RegisterInputMeta } from "@dflex/store";

import type { DraggedEvent, LayoutState } from "../types";

export interface ElmTree {
  element: IDFlexNode;
  parent: IDFlexNode | null;
  branches: {
    siblings: string[];
    parents: string[];
  };
}

export type RegisterInputOpts =
  | {
      /** provide a depth if you want to drag the parent container.  */
      depth?: number;
      /** Unique key to connect elements with the same parent together. */
      parentID?: string;
      /** True for elements that won't be transformed.  */
      readonly?: boolean;
    } & (
      | {
          id: string;
          ref: HTMLElement;
        }
      | {
          id: string;
          ref?: never;
        }
      | {
          id?: never;
          ref: HTMLElement;
        }
    );

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

export interface IDnDStore {
  readonly containers: { [SK: string]: IDFlexContainer };
  readonly unifiedContainerDimensions: {
    [depth: number]: Dimensions;
  };
  readonly tracker: ITracker;
  readonly layoutState: LayoutState;
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
  register(element: RegisterInputMeta, x?: boolean): void;
  getBranchesByDepth(dp: number): string[];
  getInitialELmRectById(id: string): RectDimensions | undefined;
  getELmTranslateById(id: string): Translate;
  getElmTreeById(id: string): ElmTree;
  getElmSiblingsById(id: string): string[] | null;
  destroy(): void;
}
