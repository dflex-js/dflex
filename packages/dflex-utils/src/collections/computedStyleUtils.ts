/* eslint-disable no-console */

import { BoxRect } from "../Box";
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
const CSS_VAL_REGEX = /^([0-9]*\.[0-9]*|[0-9]*)(px)$/;
const CSS_UNIT_REGEX = /px/;
const CSS_AUTO_VAL_REGEX = /auto|none/;
const CSS_FORBIDDEN_POSITION_REGEX = /absolute|fixed/;

function getCSSSingleValue(computedCSSValue: string) {
  const splittedVal = computedCSSValue.split(CSS_UNIT_REGEX) || [];

  return splittedVal.length === 0 ? NaN : parseFloat(splittedVal[0]);
}

function isCSSComputedValueSet(computedCSSValue: string): boolean {
  return !(
    CSS_AUTO_VAL_REGEX.test(computedCSSValue) ||
    Number.isNaN(getCSSSingleValue(computedCSSValue))
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

  if (isCSSComputedValueSet(maxWidth)) {
    DOM.style.setProperty("max-width", "none");

    if (__DEV__) {
      console.error(
        `Containers must have a fixed width. Received max-width: ${maxWidth}. Element: ${DOM.id}.`
      );
    }
  }

  if (isCSSComputedValueSet(minWidth)) {
    return;
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

function getElmMargin() {
  // const computedStyle = getElmComputedStyle(DOM);

  // const computedMargin = computedStyle.getPropertyValue("margin");

  // const splittedVal = computedMargin.split(CSS_UNIT_REGEX) || [];

  const margin = new BoxRect(0, 0, 0, 0);

  // if (splittedVal.length === 4) {
  // } else if (splittedVal.length === 3) {
  // } else if (splittedVal.length === 1) {
  // }

  return margin;
}

export {
  getElmComputedStyle,
  clearComputedStyleMap,
  setRelativePosition,
  setFixedWidth,
  getElmComputedDimensions,
  getElmMargin,
};
