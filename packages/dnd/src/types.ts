import type { ThresholdPercentages } from "@dflex/utils";
import type { Restrictions } from "./Draggable";

interface DnDEvent {
  /** Returns the time at which the event was created  */
  timeStamp: number;
}

export interface DraggedEvent extends DnDEvent {
  /** Returns the event type */
  type: "onDragOutContainer" | "onDragOutThreshold";

  /** Returns element id in the registry  */
  id: string;

  /** Returns dragged temp index */
  index: number;
}

export interface InteractivityEvent extends DnDEvent {
  /** Returns the event type */
  type: "onDragOver" | "onDragLeave";

  /** Returns element id in the registry  */
  id: string;

  /** Returns element current index */
  index: number;

  /** Returns the element that triggered the event  */
  target: HTMLElement;
}

export interface SiblingsEvent extends DnDEvent {
  /** Returns the event type */
  type: "onLiftUpSiblings" | "onMoveDownSiblings";

  /** Returns the index where the dragged left  */
  from: number;

  /** Returns the last index effected of the dragged leaving/entering  */
  to: number;

  /** Returns an array of sibling ids in order  */
  siblings: Array<string>;
}

export type LayoutState =
  | "pending"
  | "ready"
  | "dragging"
  | "dragEnd"
  | "dragCancel";

export interface LayoutStateEvent extends DnDEvent {
  /** Returns the event type */
  type: "onStateChange";

  layoutState: LayoutState;
}

export interface Events {
  /** Drag events  */
  onDragOutContainer: (event: DraggedEvent) => unknown;
  onDragOutThreshold: (event: DraggedEvent) => unknown;

  /** Interactivity events  */
  onDragOver: (event: InteractivityEvent) => unknown;
  onDragLeave: (event: InteractivityEvent) => unknown;

  /** Sibling events  */
  onLiftUpSiblings: (event: SiblingsEvent) => unknown;
  onMoveDownSiblings: (event: SiblingsEvent) => unknown;

  /** Layout events  */
  onStateChange: (layoutState: LayoutStateEvent) => unknown;
}

export interface ScrollOptWithoutThreshold {
  enable: boolean;
  initialSpeed: number;
}

export interface ScrollOptWithPartialThreshold
  extends ScrollOptWithoutThreshold {
  threshold: Partial<ThresholdPercentages>;
}

export interface ScrollOptWithThreshold extends ScrollOptWithoutThreshold {
  threshold: ThresholdPercentages;
}

export interface DefaultDndOpts {
  threshold: ThresholdPercentages;
  restrictions: Restrictions;
  scroll: ScrollOptWithThreshold;
  events: Events;
  enableContainersTransition: boolean;
}

export interface RestrictionsStatus {
  isContainerRestricted: boolean;
  isSelfRestricted: boolean;
}

export interface FinalDndOpts extends DefaultDndOpts {
  restrictionsStatus: RestrictionsStatus;
}

export interface DndOpts {
  enableContainersTransition?: boolean;
  threshold?: Partial<ThresholdPercentages>;
  restrictions?: {
    self?: Partial<Restrictions["self"]>;
    container?: Partial<Restrictions["container"]>;
  };
  scroll?: Partial<ScrollOptWithPartialThreshold>;
  events?: Partial<Events>;
}
