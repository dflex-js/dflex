// eslint-disable-next-line no-unused-vars
type AnimationFrameCallback = (timestamp: number) => void;

type RAFCleanup = () => void;

type RAFFunction = (
  // eslint-disable-next-line no-unused-vars
  callback: AnimationFrameCallback,
  // eslint-disable-next-line no-unused-vars
  cancelPrevFrame?: boolean
) => void;

function createRAF(): [RAFFunction, RAFCleanup] {
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

    id = requestAnimationFrame(callback);
  }

  return [RAF, cleanup];
}

export default createRAF;
