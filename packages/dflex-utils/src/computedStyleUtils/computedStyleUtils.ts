/* eslint-disable no-redeclare */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */

import { warnOnce } from "../collections";
import * as CSSPropNames from "../constants";
import { Dimensions } from "../types";

type ComputedStyleCacheValue = {
  computedStyle: CSSStyleDeclaration;
  parsedProperties: Map<string, string | number>;
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

function throwIfCamelCase(str: string): void {
  if (/[a-z][A-Z]/.test(str)) {
    throw new Error(`The string "${str}" is in camelCase format.`);
  }
}

function verifyTypeOrThrow(value: any, allegedType: string): void {
  const actualType = typeof value;

  if (actualType !== allegedType) {
    throw new Error(
      `Type mismatch. Expected type ${allegedType}, but got type ${actualType}.`
    );
  }
}

function getCachedComputedStyleProperty(
  DOM: Element,
  property: string,
  toNumber: true
): number;

function getCachedComputedStyleProperty(
  DOM: Element,
  property: string,
  toNumber: false
): string;

function getCachedComputedStyleProperty(
  DOM: Element,
  property: string,
  toNumber: boolean
): number | string {
  const cachedComputedStyle = getCachedComputedStyle(DOM);

  const { parsedProperties, computedStyle } = cachedComputedStyle;

  const cachedValue = parsedProperties.get(property);

  if (cachedValue === undefined) {
    if (__DEV__) {
      throwIfCamelCase(property);
    }

    const value = computedStyle.getPropertyValue(property);

    const parsedPropertyValue = toNumber
      ? parseParsedPropertyValue(value)
      : value;

    parsedProperties.set(property, parsedPropertyValue);

    return parsedPropertyValue;
  }

  // Check `cachedValue` is the same type required in the call.
  if (__DEV__) {
    verifyTypeOrThrow(cachedValue, toNumber ? "number" : "string");
  }

  return cachedValue;
}

function clearComputedStyleCache() {
  computedStyleCache = new WeakMap();
}

function getElmComputedDimensions(DOM: HTMLElement): Dimensions {
  if (__DEV__) {
    const { computedStyle } = getCachedComputedStyle(DOM);

    const computedWidth = computedStyle.getPropertyValue("width");
    const computedHeight = computedStyle.getPropertyValue("height");

    if (computedWidth.includes("%") || computedHeight.includes("%")) {
      warnOnce(
        "getElementStyle",
        "Element cannot have a percentage width and/or height." +
          "If you are expecting the element to cross multiple scroll containers, then this will cause unexpected dimension when the element is cloned."
      );
    }
  }

  const width = getCachedComputedStyleProperty(DOM, CSSPropNames.WIDTH, true);
  const height = getCachedComputedStyleProperty(DOM, CSSPropNames.HEIGHT, true);

  return { width, height };
}

type Dimension = "width" | "height";

const DIMENSION_PROPS: Record<Dimension, string[]> = {
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

function getVisibleDimension(DOM: HTMLElement, dimension: Dimension): number {
  let outerSize = 0;

  DIMENSION_PROPS[dimension].forEach((styleProp) => {
    outerSize += getCachedComputedStyleProperty(DOM, styleProp as string, true);
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

const CSS_FORBIDDEN_POSITION_REGEX = /absolute|fixed/;

const EXPECTED_POS = "relative";

const ERROR_INVALID_POSITION = (id: string, actual: string, expected: string) =>
  `setRelativePosition: Element ${id} must be positioned as relative. Found: ${actual}. Expected: ${expected}.`;

function setRelativePosition(DOM: HTMLElement): void {
  const position = getCachedComputedStyleProperty(DOM, "position", false);

  if (CSS_FORBIDDEN_POSITION_REGEX.test(position)) {
    if (__DEV__) {
      throw new Error(ERROR_INVALID_POSITION(DOM.id, position, EXPECTED_POS));
    }

    DOM.style.position = EXPECTED_POS;
  }
}

export {
  getCachedComputedStyle,
  getCachedComputedStyleProperty,
  clearComputedStyleCache,
  getElmComputedDimensions,
  setFixedDimensions,
  setRelativePosition,
};
