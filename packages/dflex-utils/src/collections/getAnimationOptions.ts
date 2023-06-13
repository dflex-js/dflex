import type { AnimationOpts } from "../types";

function getAnimationOptions(
  animation?: Partial<AnimationOpts> | null
): Required<AnimationOpts> | null {
  const defaultAnimation: AnimationOpts = {
    easing: "ease-in",
    duration: "dynamic",
  };

  if (animation === undefined) {
    return defaultAnimation;
  }

  if (animation === null) {
    return null;
  }

  return { ...defaultAnimation, ...animation };
}

export default getAnimationOptions;
