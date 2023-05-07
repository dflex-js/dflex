type DebouncedListener = () => void;

interface DebounceControl extends DebouncedListener {
  isPaused: () => boolean;
  pause: () => void;
  resume: () => void;
}

function eventDebounce(
  listener: DebouncedListener,
  immediate = false,
  throttle = 200
): DebounceControl {
  let rAFid: number | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isPaused = false;
  let lastCall = Date.now();

  const debouncedListener: DebounceControl = () => {
    if (isPaused) {
      return;
    }

    const currentTime = Date.now();
    const timeSinceLastCall = currentTime - lastCall;

    const shouldCallListener = immediate || timeSinceLastCall >= throttle;

    if (shouldCallListener) {
      if (rAFid) {
        cancelAnimationFrame(rAFid);
        rAFid = null;
      }

      rAFid = requestAnimationFrame(() => {
        listener();
        rAFid = null;
      });

      lastCall = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      // Schedule a delayed listener to be executed after the throttle period.
      timeoutId = setTimeout(() => {
        debouncedListener();
        timeoutId = null;
      }, throttle);
    }
  };

  debouncedListener.isPaused = () => isPaused;

  debouncedListener.pause = () => {
    if (!isPaused) {
      isPaused = true;
      if (rAFid) {
        cancelAnimationFrame(rAFid);
        rAFid = null;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
  };

  debouncedListener.resume = () => {
    if (isPaused) {
      isPaused = false;
      debouncedListener();
    }
  };

  return debouncedListener;
}

export default eventDebounce;
