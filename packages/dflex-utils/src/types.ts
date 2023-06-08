export interface Dimensions {
  height: number;
  width: number;
}

export type Direction = 1 | -1;

/** Single Axis. */
export type Axis = "x" | "y";

/** Bi-directional Axis. */
export type Axes = Axis | "z";

export const BOTH_AXIS: readonly Axis[] = Object.freeze(["x", "y"]);

export type CubicBezier =
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "step-start"
  | "step-end"
  | "linear"
  | "ease-in-back"
  | "ease-out-back"
  | "ease-in-out-back"
  | "ease-in-quad"
  | "ease-out-quad"
  | "ease-in-out-quad";

export type AnimationOpts = {
  /**
   * The timing function to use for the animation.
   * Specifies the speed curve of the animation.
   * Example values: 'linear', 'ease-in', 'ease-out', 'ease-in-out'.
   * (Default: 'ease')
   */
  timingFunction: CubicBezier;

  /**
   * The duration of the animation in milliseconds.
   * Specifies how long the animation should take to complete.
   * (Default: 300)
   */
  duration: number;
};
