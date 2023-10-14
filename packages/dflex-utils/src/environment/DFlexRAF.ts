// eslint-disable-next-line no-unused-vars
type AnimationFrameCallback = (timestamp: number) => void;

export type RAFCleanup = () => void;

export type RAFFunction = (
  // eslint-disable-next-line no-unused-vars
  callback: AnimationFrameCallback,
  // eslint-disable-next-line no-unused-vars
  cancelPrevFrame: boolean,
) => void;

const rafInstances: number[] = [];

function DFlexCreateRAF(): [RAFFunction, RAFCleanup] {
  let id: number | null = null;

  function cleanup(): void {
    if (id) {
      cancelAnimationFrame(id);
      id = null;
    }
  }

  function RAF(
    callback: AnimationFrameCallback,
    cancelPrevFrame: boolean,
  ): void {
    if (cancelPrevFrame) {
      cleanup();
    }

    try {
      id = requestAnimationFrame(callback);
      rafInstances.push(id);
    } catch (error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }

  return [RAF, cleanup];
}

function autoCleanupAllRAFs(): void {
  rafInstances.forEach((rafId) => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  });

  rafInstances.length = 0;
}

export { DFlexCreateRAF, autoCleanupAllRAFs };
