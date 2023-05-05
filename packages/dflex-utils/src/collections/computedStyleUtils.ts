/* eslint-disable no-console */

import { BoxRect } from "../Box";
import type { Dimensions } from "../types";
import warnOnce from "./warnOnce";
import * as CSSPropNames from "./constants";

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

const CSS_VAL_REGEX = /^([0-9]*\.[0-9]*|[0-9]*)(px)$/;
const CSS_FORBIDDEN_POSITION_REGEX = /absolute|fixed/;

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

function toNumber(val: string): number {
  return parseInt(val, 10) || 0;
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
  setFixedDimensions,
  getElmComputedDimensions,
  getElmMargin,
};
