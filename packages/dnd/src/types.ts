export interface Restrictions {
  allowLeavingFromTop: boolean;
  allowLeavingFromBottom: boolean;
  allowLeavingFromLeft: boolean;
  allowLeavingFromRight: boolean;
}

export interface Thresholds {
  vertical: number;
  horizontal: number;
}

export interface DndOpts {
  thresholds: Thresholds;
  restrictions: Restrictions;
}
