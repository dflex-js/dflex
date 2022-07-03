import type { ThresholdPercentages } from "@dflex/utils";
import type { DFlexEventsTypes } from "./LayoutManager";

type DFlexEventsMap = {
  [K in DFlexEventsTypes]: CustomEvent<any>;
};

declare global {
  interface Document {
    addEventListener<key extends keyof DFlexEventsMap>(
      DFlexEventType: key,
      listener: (this: Document, evt: DFlexEventsMap[key]) => void
    ): void;
    removeEventListener<K extends keyof DFlexEventsMap>(
      DFlexEventType: K,
      listener: (this: Document, evt: DFlexEventsMap[K]) => void
    ): void;
  }
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
  /** Default=true */
  enable: boolean;

  /**
   * Support orphan to orphan transformation.
   * Default=10px
   * */
  margin: number;
}

export interface DefaultDndOpts {
  containersTransition: ContainersTransition;
  threshold: ThresholdPercentages;
  restrictions: Restrictions;
  scroll: ScrollOpts;
}

export interface RestrictionsStatus {
  isContainerRestricted: boolean;
  isSelfRestricted: boolean;
}

export interface FinalDndOpts extends DefaultDndOpts {
  restrictionsStatus: RestrictionsStatus;
}

export interface DFlexDnDOpts {
  containersTransition?: Partial<ContainersTransition>;
  threshold?: Partial<ThresholdPercentages>;
  restrictions?: RestrictionsPartial;
  scroll?: Partial<ScrollOptPartialThreshold>;
}
