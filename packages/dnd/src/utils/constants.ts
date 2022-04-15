import type { DefaultDndOpts } from "../types";

export function noop() {}

export const defaultOpts: DefaultDndOpts = Object.freeze({
  enableContainersTransition: true,

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

  events: {
    onDragOver: noop,
    onDragLeave: noop,
    onDragOutContainer: noop,
    onDragOutThreshold: noop,
    onLiftUpSiblings: noop,
    onMoveDownSiblings: noop,
    onStateChange: noop,
  },
});
