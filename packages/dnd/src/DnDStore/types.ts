/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CoreInstanceInterface, Rect } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type { ElmInstance } from "@dflex/store";

import type { ScrollInterface } from "../Plugins/Scroll";
import type { ThresholdInterface } from "../Plugins/Threshold";
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

interface RegisterInputDepth {
  depth?: number;
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
  | (RegisterInputDepth & RegisterInputAll)
  | (RegisterInputDepth & RegisterInputID)
  | (RegisterInputDepth & RegisterInputRef);

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
  siblingsOverflow: { [siblingKey: string]: Overflow };
  siblingsScrollElement: { [siblingKey: string]: HTMLElement };
  scroll: ScrollInterface | null;
  register(element: ElmInstance, x?: boolean): void;
  initScrollContainer(
    scrollThresholdPercentages: ThresholdInterface["thresholdPercentages"]
  ): void;
  getELmOffsetById(id: string): Rect | undefined;
  getELmTranslateById(id: string): Translate;
  getElmTreeById(id: string): ElmTree;
  getElmSiblingsById(id: string): ELmBranch | null;
  getElmSiblingsListById(id: string): string[] | null;
  destroy(): null;
}
