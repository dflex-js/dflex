/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

function loopInDOM(
  fromElement: HTMLElement,
  // eslint-disable-next-line no-unused-vars
  cb: (arg: HTMLElement) => boolean
) {
  let current: HTMLElement | null = fromElement;

  do {
    if (cb(current)) {
      return current;
    }

    current = current.parentNode as HTMLElement;
  } while (current && !current.isSameNode(document.body));

  return null;
}

export default loopInDOM;
