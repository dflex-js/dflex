/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CoreInstanceInterface, Offset } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type { ElmInstance } from "@dflex/store";
import type { ThresholdPercentages } from "../Draggable";

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

export interface DnDStoreInterface {
  hasThrottledFrame: boolean;
  scrollThreshold: ScrollThreshold;
  register(element: ElmInstance, x?: boolean): void;
  seScrollViewportThreshold(
    scrollThresholdInputOpt: ThresholdPercentages
  ): void;
  getELmOffsetById(id: string): Offset | undefined;
  getELmTranslateById(id: string): Translate;
  getElmTreeById(id: string): ElmTree;
  getElmSiblingsById(id: string): ELmBranch | null;
  getElmSiblingsListById(id: string): string[] | null;
}
