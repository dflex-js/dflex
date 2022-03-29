import type { RectDimensions, RectBoundaries, IPointNum } from "@dflex/utils";
import type { CoreInstanceInterface } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type { RegisterInputMeta } from "@dflex/store";

import type { DraggedEvent, LayoutState } from "../types";

import type { ScrollInterface } from "../Plugins/Scroll";
import type { TrackerInterface } from "../Plugins/Tracker";

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
  siblingsBoundaries: { [siblingKey: string]: RectBoundaries };

  siblingsBoundariesForGrid: {
    [siblingKey: string]: {
      [row: number]: RectBoundaries;
      // grid: IPointNum;
    };
  };

  /** Numbers of total columns and rows each container has.  */
  siblingsGrid: { [siblingKey: string]: IPointNum };

  siblingsGridContainer: { [siblingKey: string]: IPointNum };

  /** Container scroll instance.  */
  siblingsScrollElement: { [siblingKey: string]: ScrollInterface };

  tracker: TrackerInterface;
  layoutState: LayoutState;
  onStateChange(state: LayoutState): void;
  emitEvent(event: DraggedEvent): void;
  register(element: RegisterInputMeta, x?: boolean): void;
  getInitialELmRectById(id: string): RectDimensions | undefined;
  getELmTranslateById(id: string): Translate;
  getElmTreeById(id: string): ElmTree;
  getElmSiblingsById(id: string): ELmBranch;
  getElmSiblingsListById(id: string): string[] | null;
  destroy(): void;
}
