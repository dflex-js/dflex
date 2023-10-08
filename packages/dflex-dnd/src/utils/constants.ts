/* eslint-disable import/prefer-default-export */
import type { DefaultDndOpts } from "../types";

export const defaultOpts: DefaultDndOpts = Object.freeze({
  containersTransition: {
    enable: true,
    margin: 10,
  },

  threshold: {
    vertical: 60,
    horizontal: 60,
  },

  restrictions: {
    self: {
      allowLeavingFromTop: true,
      allowLeavingFromBottom: true,
      allowLeavingFromLeft: true,
      allowLeavingFromRight: true,
    },
    container: {
      allowLeavingFromTop: true,
      allowLeavingFromBottom: true,
      allowLeavingFromLeft: true,
      allowLeavingFromRight: true,
    },
  },

  scroll: {
    enable: true,
    initialSpeed: 10,
    threshold: {
      vertical: 15,
      horizontal: 15,
    },
  },

  commit: {
    enableAfterEndingDrag: true,
  },
});
