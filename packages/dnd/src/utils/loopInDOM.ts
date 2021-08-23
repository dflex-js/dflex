/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

function loopInDOM(
  fromElement: Element,
  // eslint-disable-next-line no-unused-vars
  cb: (arg: Element) => boolean
) {
  let current: Element | null = fromElement;

  do {
    if (cb(current)) {
      return current;
    }

    current = current.parentNode as Element;
  } while (current && !current.isSameNode(document.body));

  return null;
}

export default loopInDOM;
