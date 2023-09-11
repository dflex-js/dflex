function noop() {}

const noopSet: Set<string> = new Set();

if (__DEV__) {
  Object.freeze(noopSet);
}

export { noop, noopSet };
