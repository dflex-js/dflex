// @ts-nocheck

// TODO: Add types for this.

import type { DndOpts, FinalDndOpts } from "../types";
import { defaultOpts, noop } from "./constants";

export function extractOpts(opts: DndOpts) {
  const options = { ...opts };

  (Object.keys(defaultOpts) as Array<keyof FinalDndOpts>).forEach((props) => {
    if (props === "restrictions") {
      options.restrictionsStatus = {
        isSelfRestricted: false,
        isContainerRestricted: false,
      };
    }

    if (options[props] === undefined) {
      options[props] =
        typeof options[props] === "object"
          ? { ...defaultOpts[props] }
          : defaultOpts[props];

      return;
    }

    Object.keys(defaultOpts[props]).forEach((subProp) => {
      // for sub options with objects values, like restrictions.
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

    if (props === "restrictions") {
      const restrictionsKeys = Object.keys(options.restrictions.self);

      let isSelfRestricted = false;

      for (let i = 0; i < restrictionsKeys.length; i += 1) {
        if (!options[props].self[restrictionsKeys[i]]) {
          isSelfRestricted = true;

          break;
        }
      }

      let isContainerRestricted = false;

      for (let i = 0; i < restrictionsKeys.length; i += 1) {
        if (!options[props].container[restrictionsKeys[i]]) {
          isContainerRestricted = true;

          break;
        }
      }

      options.restrictionsStatus.isSelfRestricted = isSelfRestricted;
      options.restrictionsStatus.isContainerRestricted = isContainerRestricted;
    } else if (props === "events") {
      Object.keys(options.events).forEach((event) => {
        if (typeof options.events[event] !== "function") {
          options.events[event] = noop;
        }
      });
    }
  });

  return options as FinalDndOpts;
}

export default extractOpts;
