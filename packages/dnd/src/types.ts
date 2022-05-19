import type { ThresholdPercentages } from "@dflex/utils";

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

interface RestrictionsMeta {
  readonly allowLeavingFromTop: boolean;
  readonly allowLeavingFromBottom: boolean;
  readonly allowLeavingFromLeft: boolean;
  readonly allowLeavingFromRight: boolean;
}

export interface Restrictions {
  self: RestrictionsMeta;
  container: RestrictionsMeta;
}

export interface RestrictionsPartial {
  self?: Partial<RestrictionsMeta>;
  container?: Partial<RestrictionsMeta>;
}

export interface ScrollOptsBase {
  enable: boolean;
  initialSpeed: number;
}

export interface ScrollOptPartialThreshold extends ScrollOptsBase {
  threshold: Partial<ThresholdPercentages>;
}

export interface ScrollOpts extends ScrollOptsBase {
  threshold: ThresholdPercentages;
}

export interface ContainersTransition {
  enable: boolean;
  margin: number;
}

export interface DefaultDndOpts {
  containersTransition: ContainersTransition;
  threshold: ThresholdPercentages;
  restrictions: Restrictions;
  scroll: ScrollOpts;
  events: Events;
}

export interface RestrictionsStatus {
  isContainerRestricted: boolean;
  isSelfRestricted: boolean;
}

export interface FinalDndOpts extends DefaultDndOpts {
  restrictionsStatus: RestrictionsStatus;
}

export interface DndOpts {
  containersTransition?: Partial<ContainersTransition>;
  threshold?: Partial<ThresholdPercentages>;
  restrictions?: RestrictionsPartial;
  scroll?: Partial<ScrollOptPartialThreshold>;
  events?: Partial<Events>;
}
