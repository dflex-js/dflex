import { noop } from ".";

let isWaiting = false;

function waitForCondition(
  condition: () => boolean,
  task: () => void,
  cb: () => void = noop
) {
  if (isWaiting) {
    // If already waiting, ignore this call.
    return;
  }

  isWaiting = true;

  function checkCondition() {
    if (condition()) {
      task();
      cb();
      isWaiting = false;

      return;
    }

    setTimeout(checkCondition, 0);
  }

  checkCondition();
}

export default waitForCondition;
