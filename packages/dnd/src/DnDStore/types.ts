import type {
  RectDimensions,
  RectBoundaries,
  IPointNum,
  ITracker,
} from "@dflex/utils";
import type { CoreInstanceInterface } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type { RegisterInputMeta } from "@dflex/store";

import type { DraggedEvent, LayoutState } from "../types";

import type { ScrollInterface } from "../Plugins/Scroll";

export interface ElmTree {
  element: CoreInstanceInterface;
  parent: CoreInstanceInterface | null;
  branches: {
    siblings: ELmBranch;
    parents: ELmBranch;
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

export interface DnDStoreInterface {
  /** Strict Rect for siblings containers. */
  readonly siblingsBoundaries: { [siblingKey: string]: RectBoundaries };

  /** Grouping containers in the same level. */
  readonly siblingDepth: {
    [depth: number]: string[];
  };

  readonly siblingsBoundariesForGrid: {
    [siblingKey: string]: {
      [row: number]: RectBoundaries;
      // grid: IPointNum;
    };
  };

  /** Numbers of total columns and rows each container has.  */
  readonly siblingsGrid: { [siblingKey: string]: IPointNum };

  readonly siblingsGridContainer: { [siblingKey: string]: IPointNum };

  /** Container scroll instance.  */
  readonly siblingsScrollElement: { [siblingKey: string]: ScrollInterface };

  readonly tracker: ITracker;
  readonly layoutState: LayoutState;
  onStateChange(state: LayoutState): void;
  emitEvent(event: DraggedEvent): void;
  register(element: RegisterInputMeta, x?: boolean): void;
  getInitialELmRectById(id: string): RectDimensions | undefined;
  getELmTranslateById(id: string): Translate;
  getElmTreeById(id: string): ElmTree;
  getElmSiblingsById(id: string): ELmBranch;
  destroy(): void;
}
