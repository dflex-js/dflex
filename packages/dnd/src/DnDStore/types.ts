import type { Dimensions, RectDimensions, ITracker, Axis } from "@dflex/utils";
import type { INode, IContainer } from "@dflex/core-instance";
import type { RegisterInputMeta } from "@dflex/store";

import type { DraggedEvent, LayoutState } from "../types";

export interface ElmTree {
  element: INode;
  parent: INode | null;
  branches: {
    siblings: string[];
    parents: string[];
  };
}

interface RegisterInputEssential {
  /** provide a depth if you want to drag the parent container  */
  depth?: number;
  /** Unique key to connect elements with the same parent together */
  parentID?: string;
}

interface RegisterInputID {
  id: string;
  ref?: never;
}

interface RegisterInputRef {
  id?: never;
  ref: HTMLElement;
}

interface RegisterInputAll {
  id: string;
  ref: HTMLElement;
}

export type RegisterInput =
  | (RegisterInputEssential & RegisterInputAll)
  | (RegisterInputEssential & RegisterInputID)
  | (RegisterInputEssential & RegisterInputRef);

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

export interface IDnDStore {
  readonly containers: { [SK: string]: IContainer };
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
    appendOffset: RectDimensions,
    axis: Axis
  ): void;
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
