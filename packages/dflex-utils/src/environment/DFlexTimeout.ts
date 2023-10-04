import { noop } from "../collections";

type TimeoutCallback = () => void;

export type TimeoutCleanup = () => void;

export type TimeoutFunction = (
  // eslint-disable-next-line no-unused-vars
  callback: TimeoutCallback | null,
  // eslint-disable-next-line no-unused-vars
  cancelPrevSchedule: boolean,
) => void;

export type IsThrottledFunction = () => boolean;

const timeoutInstances: TimeoutCleanup[] = [];

function DFlexCreateTimeout(
  msDelay: number,
): [TimeoutFunction, TimeoutCleanup, IsThrottledFunction] {
  let id: ReturnType<typeof setTimeout> | null = null;
  let isThrottled: boolean = false;

  function cleanup(): void {
    if (id) {
      clearTimeout(id);
      id = null;
    }
  }

  function timeout(
    callback: TimeoutCallback | null,
    cancelPrevSchedule: boolean,
  ): void {
    const cb = callback || noop;
    isThrottled = true;

    if (cancelPrevSchedule) {
      cleanup();
    }

    id = setTimeout(() => {
      isThrottled = false;
      cb();
    }, msDelay);
  }

  function getIsThrottled(): boolean {
    return isThrottled;
  }

  timeoutInstances.push(cleanup);

  return [timeout, cleanup, getIsThrottled];
}

function autoCleanupAllTimeouts(): void {
  timeoutInstances.forEach((cleanup) => {
    cleanup();
  });
}

export { autoCleanupAllTimeouts, DFlexCreateTimeout };
