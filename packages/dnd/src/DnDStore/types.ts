import type { CoreInstanceInterface, Rect } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type { ElmInstance } from "@dflex/store";

import type {
  Events,
  DnDEventTypes,
  DraggedEvent,
  LayoutState,
} from "../types";

import type { ScrollInterface } from "../Plugins/Scroll";
import type { TrackerInterface } from "../Plugins/Tracker";

export interface BoundariesOffset {
  top: number;
  maxLeft: number;
  minRight: number;
  bottom: number;
}

export interface ElmTree {
  element: CoreInstanceInterface;
  parent: CoreInstanceInterface | null;
  branches: {
    siblings: ELmBranch;
    parents: ELmBranch;
  };
}

export interface Translate {
  translateX: number;
  translateY: number;
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

export interface Overflow {
  x: boolean;
  y: boolean;
}

export interface DnDStoreInterface {
  tracker: TrackerInterface;
  siblingsBoundaries: { [siblingKey: string]: BoundariesOffset };
  siblingsScrollElement: { [siblingKey: string]: ScrollInterface };
  layoutState: LayoutState;
  onStateChange(state: LayoutState): void;
  emitEvent(event: DraggedEvent): void;
  register(element: ElmInstance, x?: boolean): void;
  getInitialELmRectById(id: string): Rect | undefined;
  getELmTranslateById(id: string): Translate;
  getElmTreeById(id: string): ElmTree;
  getElmSiblingsById(id: string): ELmBranch;
  getElmSiblingsListById(id: string): string[] | null;
  destroy(): void;
}
