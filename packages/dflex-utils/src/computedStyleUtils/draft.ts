import * as CSSPropNames from "../constants";

type ComputedStyleCacheValue = {
  computedStyle: CSSStyleDeclaration;
  parsedProperties: Map<string, number>;
};

let computedStyleCache = new WeakMap<Element, ComputedStyleCacheValue>();

function parseParsedPropertyValue(value: string): number {
  const parsedValue = parseFloat(value);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

function getCachedComputedStyle(DOM: Element): ComputedStyleCacheValue {
  if (computedStyleCache.has(DOM)) {
    return computedStyleCache.get(DOM)!;
  }

  const computedStyle = getComputedStyle(DOM);
  const parsedProperties = new Map<string, number>();

  const computedStyleCacheValue = { computedStyle, parsedProperties };

  computedStyleCache.set(DOM, computedStyleCacheValue);

  return computedStyleCacheValue;
}

function getCachedComputedStyleProperty(
  DOM: Element,
  property: string
): number {
  const computedStyleCacheValue = getCachedComputedStyle(DOM);
  const { parsedProperties } = computedStyleCacheValue;

  const cachedValue = parsedProperties.get(property);

  if (cachedValue === undefined) {
    const parsedPropertyValue = parseParsedPropertyValue(property);

    parsedProperties.set(property, parsedPropertyValue);

    return parsedPropertyValue;
  }

  return cachedValue;
}

function clearComputedStyleCache() {
  computedStyleCache = new WeakMap();
}

type Dimension = "width" | "height";

const DIMENSION_PROPS: Record<Dimension, (keyof CSSStyleDeclaration)[]> = {
  height: [
    CSSPropNames.BORDER_TOP_WIDTH,
    CSSPropNames.BORDER_BOTTOM_WIDTH,
    CSSPropNames.PADDING_TOP,
    CSSPropNames.PADDING_BOTTOM,
  ],

  width: [
    CSSPropNames.BORDER_LEFT_WIDTH,
    CSSPropNames.BORDER_RIGHT_WIDTH,
    CSSPropNames.PADDING_LEFT,
    CSSPropNames.PADDING_RIGHT,
  ],
};

const OFFSET_PROPS: Record<Dimension, "offsetHeight" | "offsetWidth"> = {
  height: CSSPropNames.OFFSET_HEIGHT,
  width: CSSPropNames.OFFSET_WIDTH,
};

function toNumber(val: string): number {
  return parseInt(val, 10) || 0;
}

function getVisibleDimension(DOM: HTMLElement, dimension: Dimension): number {
  const computedStyle = getComputedStyle(DOM);

  let outerSize = 0;

  DIMENSION_PROPS[dimension].forEach((styleProp) => {
    outerSize += toNumber(computedStyle[styleProp] as string);
  });

  const totalDimension = DOM[OFFSET_PROPS[dimension]] - outerSize;

  return totalDimension;
}

function setFixedDimensions(DOM: HTMLElement): void {
  const visibleHeight = getVisibleDimension(DOM, CSSPropNames.HEIGHT);
  const visibleWidth = getVisibleDimension(DOM, CSSPropNames.WIDTH);

  DOM.style.setProperty(CSSPropNames.HEIGHT, `${visibleHeight}px`);
  DOM.style.setProperty(CSSPropNames.WIDTH, `${visibleWidth}px`);
}

export {
  getCachedComputedStyle,
  getCachedComputedStyleProperty,
  clearComputedStyleCache,
  setFixedDimensions,
};
