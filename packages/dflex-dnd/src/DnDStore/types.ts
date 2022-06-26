import type { Dimensions, ITracker } from "@dflex/utils";
import type {
  IDFlexContainer,
  IDFlexNode,
  SerializedDFlexCoreNode,
} from "@dflex/core-instance";

import type { RegisterInputOpts, IDFlexBaseStore } from "@dflex/store";
import type { DFlexListenerPlugin } from "./DFlexListeners";

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

export interface IDFlexDnDStore extends IDFlexBaseStore {
  readonly containers: Map<string, IDFlexContainer>;
  readonly unifiedContainerDimensions: Map<number, Dimensions>;
  readonly tracker: ITracker;
  observer: MutationObserver | null;
  listeners: DFlexListenerPlugin;
  initSiblingContainer(SK: string, shouldValidate: boolean): void;
  register(element: RegisterInputOpts): void;
  getElmTreeById(id: string): ElmTree;
  getElmSiblingsById(id: string): string[] | null;
  getSerializedElm(id: string): SerializedDFlexCoreNode | null;
  destroy(): void;
}
