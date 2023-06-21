type TimeoutCallback = () => void;

type TimeoutCleanup = () => void;

type TimeoutFunction = (
  // eslint-disable-next-line no-unused-vars
  callback: TimeoutCallback,
  // eslint-disable-next-line no-unused-vars
  delay: number,
  // eslint-disable-next-line no-unused-vars
  cancelPrevSchedule: boolean
) => void;

function DFlexCreateTimeout(): [TimeoutFunction, TimeoutCleanup] {
  let id: ReturnType<typeof setTimeout> | null = null;

  function cleanup(): void {
    if (id) {
      clearTimeout(id);
      id = null;
    }
  }

  function timeout(
    callback: TimeoutCallback,
    delay: number,
    cancelPrevSchedule: boolean
  ): void {
    if (cancelPrevSchedule) {
      cleanup();
    }

    id = setTimeout(callback, delay);
  }

  return [timeout, cleanup];
}

export default DFlexCreateTimeout;
