/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CoreInstanceInterface, Offset } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type { ElmInstance } from "@dflex/store";

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

export interface DnDStoreInterface {
  reattachElmRef(id: string, elmRef: HTMLElement): void;
  register(element: ElmInstance): void;
  getELmOffsetById(id: string): Offset;
  getELmTranslateById(id: string): Translate;
  getElmTreeById(id: string): ElmTree;
  getElmSiblingsById(id: string): ELmBranch;
}
