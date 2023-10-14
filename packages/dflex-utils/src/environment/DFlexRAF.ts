// eslint-disable-next-line no-unused-vars
type AnimationFrameCallback = (timestamp: number) => void;

type IsRafDone = () => boolean;

export type RAFCleanup = () => void;

export type RAFFunction = (
  // eslint-disable-next-line no-unused-vars
  callback: AnimationFrameCallback,
  // eslint-disable-next-line no-unused-vars
  cancelPrevFrame: boolean,
) => void;

// Maintain array of active RAF ids
const activeRAFIds: number[] = [];

// Utility to cancel RAF
function cancelRAF(rafId: number): void {
  cancelAnimationFrame(rafId);
}

// Inject completion logic into callback
function injectRAFCompleteCheck(
  callback: AnimationFrameCallback,
  rafDone: RAFCleanup,
): AnimationFrameCallback {
  return (timestamp: number) => {
    callback(timestamp);
    rafDone();
  };
}

function DFlexCreateRAF(): [RAFFunction, RAFCleanup, IsRafDone] {
  let rafId: number;
  let isCompleted: boolean = true;

  function rafDone(): void {
    isCompleted = true;
  }

  function isRafDone(): boolean {
    return isCompleted;
  }

  function cleanup(): void {
    cancelRAF(rafId);
    activeRAFIds.splice(activeRAFIds.indexOf(rafId), 1);
  }

  function RAF(
    callback: AnimationFrameCallback,
    cancelPrevFrame: boolean,
  ): void {
    if (cancelPrevFrame) {
      cleanup();
    }

    try {
      isCompleted = false;
      const wrappedCallback = injectRAFCompleteCheck(callback, rafDone);
      rafId = requestAnimationFrame(wrappedCallback);
      activeRAFIds.push(rafId);
    } catch (error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }

  return [RAF, cleanup, isRafDone];
}

function autoCleanupAllRAFs(): void {
  activeRAFIds.forEach(cancelRAF);
  activeRAFIds.length = 0;
}

export { DFlexCreateRAF, autoCleanupAllRAFs };
