// eslint-disable-next-line no-unused-vars
type AnimationFrameCallback = (timestamp: number) => void;

type RAFCleanup = () => void;

export type RAFFunction = (
  // eslint-disable-next-line no-unused-vars
  callback: AnimationFrameCallback,
  // eslint-disable-next-line no-unused-vars
  cancelPrevFrame: boolean
) => void;

type IsRAFActive = () => boolean;

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
    cancelPrevFrame: boolean = false
  ): void {
    if (cancelPrevFrame) {
      cleanup();
    }

    id = requestAnimationFrame((ts) => {
      callback(ts);
      id = null;
    });
  }

  function isRAFActive() {
    return id !== null;
  }

  return [RAF, cleanup, isRAFActive];
}

export default createRAF;
