/* eslint-disable no-console */

import type { Dimensions } from "../types";
import warnOnce from "./warnOnce";

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

// TODO: Improve regex.
const CSS_VAL_REGEX = /^([0-9]*\.[0-9]*|[0-9]*)(px|em|rem|vw|vh)$/;
const CSS_UNIT_REGEX = /px|em|rem|vw|vh/;
const CSS_AUTO_VAL_REGEX = /auto|none/;
const CSS_FORBIDDEN_POSITION_REGEX = /absolute|fixed/;

function isCSSComputedValueSet(computedCSSValue: string): boolean {
  return !(
    parseFloat((computedCSSValue.match(CSS_UNIT_REGEX) || [])[1]) === 0 ||
    CSS_AUTO_VAL_REGEX.test(computedCSSValue) ||
    computedCSSValue.includes("%")
  );
}

function setRelativePosition(DOM: HTMLElement): void {
  const computedStyle = getElmComputedStyle(DOM);

  const position = computedStyle.getPropertyValue("position");

  if (CSS_FORBIDDEN_POSITION_REGEX.test(position)) {
    if (__DEV__) {
      throw new Error(
        `Containers must be positioned as relative. Received: ${position}. Element: ${DOM.id}.`
      );
    }

    DOM.style.position = "relative";
  }
}

function setFixedWidth(DOM: HTMLElement): void {
  const computedStyle = getElmComputedStyle(DOM);

  const minWidth = computedStyle.getPropertyValue("min-width");
  const maxWidth = computedStyle.getPropertyValue("max-width");

  if (isCSSComputedValueSet(minWidth)) {
    DOM.style.setProperty("min-width", "none");

    if (__DEV__) {
      console.error(
        `Containers must have a fixed width. Received min-width: ${minWidth}. Element: ${DOM.id}.`
      );
    }
  }

  if (isCSSComputedValueSet(maxWidth)) {
    DOM.style.setProperty("max-width", "none");

    if (__DEV__) {
      console.error(
        `Containers must have a fixed width. Received max-width: ${maxWidth}. Element: ${DOM.id}.`
      );
    }
  }

  DOM.style.setProperty("width", computedStyle.getPropertyValue("width"));
}

function getComputedDimension(
  computedStyle: CSSStyleDeclaration,
  dimension: "width" | "height"
) {
  const computedUnit = computedStyle.getPropertyValue(dimension);
  const match = computedUnit.match(CSS_VAL_REGEX);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Gets elements width and height. Used for ghosting drag.
 *
 * @param DOM
 * @returns
 */
function getElmComputedDimensions(DOM: HTMLElement): Dimensions {
  const computedStyle = getElmComputedStyle(DOM);

  if (__DEV__) {
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

  const width = getComputedDimension(computedStyle, "width");
  const height = getComputedDimension(computedStyle, "height");

  return { width, height };
}

export {
  getElmComputedStyle,
  clearComputedStyleMap,
  setRelativePosition,
  setFixedWidth,
  getElmComputedDimensions,
};
