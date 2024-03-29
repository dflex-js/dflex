export { AxesPoint, Point, PointNum, PointBool } from "./Point";
export { AbstractBox, Box, BoxBool, BoxNum, BoxRect } from "./Box";
export type { AbstractBoxRect } from "./Box";

export { DFlexThreshold as Threshold, ThresholdDeadZone } from "./Threshold";
export type { ThresholdPercentages } from "./Threshold";

export {
  tracker,
  PREFIX_TRACKER_CYCLE,
  PREFIX_TRACKER_ID,
  PREFIX_TRACKER_KY,
} from "./DFlexTracker";

export { default as TaskQueue } from "./TaskQueue";
export { default as eventDebounce } from "./DFlexEventDebounce";

export { DFlexCycle } from "./DFlexCycle";
export type { AbstractDFlexCycle } from "./DFlexCycle";

export type {
  Dimensions,
  Axis,
  Axes,
  Direction,
  AnimationOpts,
  CubicBezier,
  CSSStyle,
  CSSClass,
  CSS,
} from "./types";
export { BOTH_AXIS } from "./types";

export {
  noop,
  noopSet,
  combineKeys,
  warnOnce,
  assertElmPos,
  getDimensionTypeByAxis,
  getStartingPointByAxis,
  getEndingPointByAxis,
  getOppositeAxis,
  getAnimationOptions,
} from "./collections";

export {
  getCachedComputedStyleProperty,
  clearComputedStyleCache,
  setStyleProperty,
  removeOpacity,
  removeStyleProperty,
  setRelativePosition,
  setFixedDimensions,
  setParentDimensions,
  getElmDimensions,
  getElmPos,
  getElmOverflow,
  getParsedElmTransform,
  hasCSSTransition,
  rmEmptyAttr,
} from "./computedStyleUtils";

export type {
  RAFFunction,
  RAFCleanup,
  TimeoutCleanup,
  TimeoutFunction,
  IsThrottledFunction,
} from "./environment";

export {
  canUseDOM,
  getSelection,
  getParentElm,
  updateElmDatasetGrid,
  updateDOMAttr,
  updateIndexAttr,
  DFlexCreateRAF,
  autoCleanupAllRAFs,
  DFlexCreateTimeout,
  autoCleanupAllTimeouts,
  getElmBoxRect,
} from "./environment";

export * as featureFlags from "./FeatureFlags";
