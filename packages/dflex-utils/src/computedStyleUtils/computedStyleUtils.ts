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
      `Type mismatch. Expected type ${allegedType}, but got type ${actualType}.`,
    );
  }
}

function setStyleProperty(
  DOM: HTMLElement,
  property: string,
  value: string | null,
): void {
  DOM.style.setProperty(property, value);
}

function removeStyleProperty(DOM: HTMLElement, property: string): void {
  DOM.style.removeProperty(property);
}

function getCachedComputedStyleProperty(
  DOM: Element,
  property: string,
  toNumber: true,
): number;

function getCachedComputedStyleProperty(
  DOM: Element,
  property: string,
  toNumber: false,
): string;

function getCachedComputedStyleProperty(
  DOM: Element,
  property: string,
  toNumber: boolean,
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

function getElmDimensions(DOM: HTMLElement): Dimensions {
  if (__DEV__) {
    const { computedStyle } = getCachedComputedStyle(DOM);

    const computedWidth = computedStyle.getPropertyValue("width");
    const computedHeight = computedStyle.getPropertyValue("height");

    if (computedWidth.includes("%") || computedHeight.includes("%")) {
      warnOnce(
        "getElementStyle",
        "Element cannot have a percentage width and/or height." +
          "If you are expecting the element to cross multiple scroll containers, then this will cause unexpected dimension when the element is cloned.",
      );
    }
  }

  const width = getCachedComputedStyleProperty(DOM, CSSPropNames.WIDTH, true);
  const height = getCachedComputedStyleProperty(DOM, CSSPropNames.HEIGHT, true);

  return { width, height };
}

function parseTransformMatrix(transform: string): [number, number] | null {
  const matrixPattern = /matrix\([^)]+\)/;

  if (!matrixPattern.test(transform)) {
    return null;
  }

  // Check if the transform property contains a matrix transform
  const matrixMatch = transform.match(
    /matrix\(\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/,
  );

  if (matrixMatch) {
    const translateX = parseFloat(matrixMatch[5]);
    const translateY = parseFloat(matrixMatch[6]);

    return [translateX, translateY];
  }

  // Return null if no matrix transform is found
  return null;
}

function getParsedElmTransform(DOM: HTMLElement): [number, number] | null {
  const transform = getCachedComputedStyleProperty(
    DOM,
    CSSPropNames.TRANSFORM,
    false,
  );

  const transformMatrix = parseTransformMatrix(transform);

  return transformMatrix;
}

// type Dimension = "width" | "height";

// const DIMENSION_PROPS: Record<Dimension, string[]> = {
//   height: [
//     CSSPropNames.BORDER_TOP_WIDTH,
//     CSSPropNames.BORDER_BOTTOM_WIDTH,
//     CSSPropNames.PADDING_TOP,
//     CSSPropNames.PADDING_BOTTOM,
//   ],

//   width: [
//     CSSPropNames.BORDER_LEFT_WIDTH,
//     CSSPropNames.BORDER_RIGHT_WIDTH,
//     CSSPropNames.PADDING_LEFT,
//     CSSPropNames.PADDING_RIGHT,
//   ],
// };

// const OFFSET_PROPS: Record<Dimension, "offsetHeight" | "offsetWidth"> = {
//   height: CSSPropNames.OFFSET_HEIGHT,
//   width: CSSPropNames.OFFSET_WIDTH,
// };

// function getVisibleDimension(DOM: HTMLElement, dimension: Dimension): number {
//   let outerSize = 0;

//   DIMENSION_PROPS[dimension].forEach((styleProp) => {
//     outerSize += getCachedComputedStyleProperty(DOM, styleProp as string, true);
//   });

//   const totalDimension = DOM[OFFSET_PROPS[dimension]] - outerSize;

//   return totalDimension;
// }

function setFixedDimensions(DOM: HTMLElement): void {
  // const visibleHeight = getVisibleDimension(DOM, CSSPropNames.HEIGHT);
  // const visibleWidth = getVisibleDimension(DOM, CSSPropNames.WIDTH);

  const { height, width } = getElmDimensions(DOM);

  setStyleProperty(DOM, CSSPropNames.HEIGHT, `${height}px`);
  setStyleProperty(DOM, CSSPropNames.WIDTH, `${width}px`);
}

const CSS_FORBIDDEN_POSITION_REGEX = /absolute|fixed/;

const EXPECTED_POS: CSSPosition = "relative";

const ERROR_INVALID_POSITION = (id: string, actual: string, expected: string) =>
  `setRelativePosition: Element ${id} must be positioned as relative. Found: ${actual}. Expected: ${expected}.`;

type CSSPosition = "static" | "relative" | "absolute" | "fixed" | "sticky";

function getElmPos(DOM: HTMLElement): CSSPosition {
  return getCachedComputedStyleProperty(
    DOM,
    CSSPropNames.POSITION,
    false,
  ) as CSSPosition;
}

type CSSOverflow = "visible" | "hidden" | "scroll" | "auto" | "overlay";

type CSSOverflowType = "overflow" | "overflow-x" | "overflow-y";

function getElmOverflow(
  DOM: HTMLElement,
  overflowType: CSSOverflowType,
): CSSOverflow {
  return getCachedComputedStyleProperty(
    DOM,
    overflowType,
    false,
  ) as CSSOverflow;
}

function setRelativePosition(DOM: HTMLElement): void {
  const position = getElmPos(DOM);

  if (CSS_FORBIDDEN_POSITION_REGEX.test(position)) {
    if (__DEV__) {
      throw new Error(ERROR_INVALID_POSITION(DOM.id, position, EXPECTED_POS));
    }

    setStyleProperty(DOM, CSSPropNames.POSITION, EXPECTED_POS);
  }
}

function removeOpacity(DOM: HTMLElement): void {
  const opacityValue = getCachedComputedStyleProperty(
    DOM,
    CSSPropNames.OPACITY,
    true,
  );

  if (opacityValue !== 1) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error(
        `The application of opacity to the element with id '${DOM.id}' ` +
          `may interfere with its z-index, which is crucial for establishing the visual hierarchy. ` +
          `To ensure proper positioning of the drag element above others, DFlex will remove it.`,
      );
    }

    setStyleProperty(DOM, CSSPropNames.OPACITY, "1");
  }
}

function setParentDimensions(DOM: HTMLElement): void {
  const getStyle = (property: string) =>
    getCachedComputedStyleProperty(DOM, property, false);

  const height = getStyle(CSSPropNames.HEIGHT);
  const width = getStyle(CSSPropNames.WIDTH);
  const minHeight = getStyle(CSSPropNames.MIN_HEIGHT);
  const minWidth = getStyle(CSSPropNames.MIN_HEIGHT);

  const hasMinHeight = minHeight !== "auto";
  const hasMinWidth = minWidth !== "auto";

  if (!hasMinHeight) {
    setStyleProperty(DOM, CSSPropNames.MIN_HEIGHT, height);
  }

  if (!hasMinWidth) {
    setStyleProperty(DOM, CSSPropNames.MIN_WIDTH, width);
  }
}

function hasCSSTransition(DOM: HTMLElement) {
  const transitionValue = getCachedComputedStyleProperty(
    DOM,
    "transition",
    false,
  );

  return transitionValue !== "none" && transitionValue.trim() !== "";
}

function rmEmptyAttr(DOM: HTMLElement, attribute: string) {
  if (!DOM.hasAttribute(attribute)) {
    return;
  }

  const value = DOM.getAttribute(attribute);

  if (value && value.trim() === "") {
    DOM.removeAttribute(attribute);
  }
}

export {
  getCachedComputedStyle,
  getCachedComputedStyleProperty,
  clearComputedStyleCache,
  getElmPos,
  getElmOverflow,
  getElmDimensions,
  getParsedElmTransform,
  setStyleProperty,
  removeOpacity,
  removeStyleProperty,
  setFixedDimensions,
  setRelativePosition,
  setParentDimensions,
  hasCSSTransition,
  rmEmptyAttr,
};
