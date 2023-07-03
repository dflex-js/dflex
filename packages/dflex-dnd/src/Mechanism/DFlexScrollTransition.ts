import {
  Axis,
  Direction,
  DFlexCreateRAF,
  getStartingPointByAxis,
} from "@dflex/utils";

import type { DFlexScrollContainer } from "@dflex/core-instance";

// eslint-disable-next-line no-unused-vars
type Accelerator = (progress: number) => number;

export type ScrollTransitionAbort = () => void;

function DFlexScrollTransition(
  scroll: DFlexScrollContainer,
  axis: Axis,
  direction: Direction,
  duration: number | null,
  accelerator: Accelerator,
  onComplete: () => void,
  onAbort: () => void
): ScrollTransitionAbort {
  let startScroll: number;
  let distance: number;

  let calculatedDuration = duration || 0;

  let startTime: number;
  let aborted = false;

  const [RAF, cancelRAF] = DFlexCreateRAF();

  const step = (timestamp: number) => {
    if (!startTime) {
      startTime = timestamp;
      startScroll = scroll.totalScrollRect[getStartingPointByAxis(axis)];
      distance = scroll.calculateDistance(axis, direction);

      calculatedDuration = calculatedDuration || Math.sqrt(distance) * 75;
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / calculatedDuration, 1);

    const easedProgress = accelerator(progress);

    const scrollPosition = startScroll + direction * (distance * easedProgress);

    if (axis === "x") {
      scroll.scrollTo(scrollPosition, -1);
    } else {
      scroll.scrollTo(-1, scrollPosition);
    }

    if (!aborted && progress < 1) {
      RAF(step, false);
    } else if (onComplete) {
      onComplete();
    }
  };

  const abortScroll = () => {
    aborted = true;
    cancelRAF();
    onAbort();
  };

  RAF(step, false);

  return abortScroll;
}

export default DFlexScrollTransition;
