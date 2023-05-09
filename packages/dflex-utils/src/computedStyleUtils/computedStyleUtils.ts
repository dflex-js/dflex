/* eslint-disable no-console */

import type { Dimensions } from "../types";
import warnOnce from "../collections/warnOnce";
import { getCachedComputedStyle } from "./draft";

const CSS_VAL_REGEX = /^([0-9]*\.[0-9]*|[0-9]*)(px)$/;
const CSS_FORBIDDEN_POSITION_REGEX = /absolute|fixed/;

const EXPECTED_POS = "relative";

const ERROR_INVALID_POSITION = (id: string, actual: string, expected: string) =>
  `setRelativePosition: Element ${id} must be positioned as relative. Found: ${actual}. Expected: ${expected}.`;

function setRelativePosition(DOM: HTMLElement): void {
  const { computedStyle } = getCachedComputedStyle(DOM);

  const position = computedStyle.getPropertyValue("position");

  if (CSS_FORBIDDEN_POSITION_REGEX.test(position)) {
    if (__DEV__) {
      throw new Error(ERROR_INVALID_POSITION(DOM.id, position, EXPECTED_POS));
    }

    DOM.style.position = EXPECTED_POS;
  }
}

type Dimension = "width" | "height";

function getComputedDimension(
  computedStyle: CSSStyleDeclaration,
  dimension: Dimension
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
  const { computedStyle } = getCachedComputedStyle(DOM);

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

export { setRelativePosition, getElmComputedDimensions };
