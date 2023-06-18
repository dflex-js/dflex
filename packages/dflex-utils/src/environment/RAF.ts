// eslint-disable-next-line no-unused-vars
type AnimationFrameCallback = (timestamp: number) => void;

export type RAFCleanup = () => void;

export type RAFFunction = (
  // eslint-disable-next-line no-unused-vars
  callback: AnimationFrameCallback,
  // eslint-disable-next-line no-unused-vars
  cancelPrevFrame: boolean
) => void;

export type IsRAFActive = () => boolean;

function createRAF(): [RAFFunction, RAFCleanup, IsRAFActive] {
  let id: number | null = null;

  const cleanup: RAFCleanup = (): void => {
    if (id) {
      cancelAnimationFrame(id);
      id = null;
    }
  };

  function RAF(
    callback: AnimationFrameCallback,
    cancelPrevFrame: boolean
  ): void {
    if (cancelPrevFrame) {
      cleanup();
    }

    try {
      id = requestAnimationFrame((ts) => {
        callback(ts);
        id = null;
      });
    } catch (error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }

  function isRAFActive(): boolean {
    return typeof id === "number";
  }

  return [RAF, cleanup, isRAFActive];
}

export default createRAF;
