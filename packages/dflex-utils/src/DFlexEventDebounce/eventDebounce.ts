import { DFlexCreateRAF, DFlexCreateTimeout } from "../environment";

type DebouncedListener = () => void;

interface DebounceControl extends DebouncedListener {
  isPaused: () => boolean;
  pause: () => void;
  resume: () => void;
}

function DFlexEventDebounce(
  listener: DebouncedListener,
  immediate = false,
  throttle = 200,
): DebounceControl {
  const [timeout, cancelTimeout] = DFlexCreateTimeout(throttle);
  const [RAF, cancelRAF] = DFlexCreateRAF();

  let lastCall = performance.now();
  let isPaused = false;

  const debouncedListener: DebounceControl = () => {
    if (isPaused) {
      return;
    }

    const currentTime = performance.now();
    const timeSinceLastCall = currentTime - lastCall;

    const shouldCallListener = immediate || timeSinceLastCall >= throttle;

    if (shouldCallListener) {
      // Schedule a animated frame and cancel previous one.
      RAF(listener, true);
      lastCall = currentTime;
    } else {
      // Schedule a delayed listener to be executed after the throttle period and cancel previous schedule.
      timeout(debouncedListener, true);
    }
  };

  debouncedListener.isPaused = () => isPaused;

  debouncedListener.pause = () => {
    if (!isPaused) {
      isPaused = true;
      cancelRAF();
      cancelTimeout();
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

export default DFlexEventDebounce;
