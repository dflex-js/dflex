let computedStyleMap = new WeakMap<HTMLElement, CSSStyleDeclaration>();

/**
 * Gets cached computed style if available.
 *
 * @param DOM
 * @returns
 */
function getElmComputedStyle(DOM: HTMLElement): CSSStyleDeclaration {
  if (computedStyleMap.has(DOM)) {
    return computedStyleMap.get(DOM)!;
  }

  const computedStyle = getComputedStyle(DOM);

  computedStyleMap.set(DOM, computedStyle);

  return computedStyle;
}

function clearComputedStyleMap() {
  computedStyleMap = new WeakMap();
}

export { getElmComputedStyle, clearComputedStyleMap };
