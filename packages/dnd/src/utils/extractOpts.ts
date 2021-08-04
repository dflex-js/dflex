/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-nocheck

// TODO: Do you love typescript? Here we go buddy. It's your chance. Start your
// PR. Don't be shy. I'll be waiting.

import type { DndOpts, FinalDndOpts } from "../types";

export const defaultOpts: DndOpts = Object.freeze({
  threshold: {
    vertical: 60,
    horizontal: 60,
  },

  restrictions: {
    allowLeavingFromTop: true,
    allowLeavingFromBottom: true,
    allowLeavingFromLeft: true,
    allowLeavingFromRight: true,
  },

  scroll: {
    enable: false,
    speed: 10,
    threshold: {
      vertical: 75,
      horizontal: 75,
    },
  },
});

export function extractOpts(opts: DndOpts) {
  const options = { ...opts };

  (Object.keys(defaultOpts) as Array<keyof FinalDndOpts>).forEach((props) => {
    if (!options[props]) {
      options[props] = { ...defaultOpts[props] };

      return;
    }

    Object.keys(defaultOpts[props]).forEach((subProp) => {
      if (typeof defaultOpts[props][subProp] === "object") {
        if (options[props][subProp] !== undefined) {
          options[props][subProp] = {
            ...defaultOpts[props][subProp],
            ...options[props][subProp],
          };

          return;
        }

        options[props][subProp] = { ...defaultOpts[props][subProp] };

        return;
      }

      if (options[props][subProp] === undefined) {
        options[props][subProp] = defaultOpts[props][subProp];
      }
    });
  });

  return options as FinalDndOpts;
}

export default extractOpts;
