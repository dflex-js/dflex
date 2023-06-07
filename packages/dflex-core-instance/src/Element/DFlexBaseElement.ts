/* eslint-disable no-underscore-dangle */
import { PointNum } from "@dflex/utils";

import { DFLEX_ATTRIBUTES } from "./constants";
import type { AllowedAttributes } from "./constants";

type AttributeSet = Set<Exclude<AllowedAttributes, "INDEX">>;

function transform(DOM: HTMLElement, x: number, y: number): void {
  DOM.style.setProperty("transform", `translate3d(${x}px, ${y}px, 0)`);
}

type CubicBezier =
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "step-start"
  | "step-end"
  | "linear"
  | "ease-in-back"
  | "ease-out-back"
  | "ease-in-out-back"
  | "ease-in-quad"
  | "ease-out-quad"
  | "ease-in-out-quad";

function removeTransition(DOM: HTMLElement) {
  DOM.style.removeProperty("transition-delay");
  DOM.style.removeProperty("transition-duration");
  DOM.style.removeProperty("transition-timing-function");
}

function validateEasing(easing: string): void {
  const cubicBezierRegex = /^cubic-bezier\(([^,]+),([^,]+),([^,]+),([^)]+)\)$/;

  const validEasingValues = [
    "linear",
    "ease",
    "ease-in",
    "ease-out",
    "ease-in-out",
    "step-start",
    "step-end",
  ];

  if (!(cubicBezierRegex.test(easing) || validEasingValues.includes(easing))) {
    throw new Error(`Invalid easing function: ${easing}`);
  }
}

interface HTMLElementWithTransitionTimeout extends HTMLElement {
  __transitionTimeoutId?: ReturnType<typeof setTimeout> | null;
}

function transition(
  DOM: HTMLElementWithTransitionTimeout,
  delay: number,
  duration: number,
  easing: CubicBezier
): void {
  if (__DEV__) {
    if (easing) {
      try {
        validateEasing(easing);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return;
      }
    }
  }

  // Set the transition properties using setProperty
  DOM.style.setProperty("transition-delay", `${delay}ms`);
  DOM.style.setProperty("transition-duration", `${duration}ms`);
  DOM.style.setProperty("transition-timing-function", easing);

  // Reset the transition after the animation completes
  if (duration > 0) {
    const timeoutId = setTimeout(() => {
      removeTransition(DOM);
    }, duration);

    // Cancel the previous timeout if this function is called again before the previous animation completes
    if (DOM.__transitionTimeoutId) {
      clearTimeout(DOM.__transitionTimeoutId);
    }

    // Store the timeout ID on the element for future reference
    DOM.__transitionTimeoutId = timeoutId;
  } else {
    removeTransition(DOM);
  }
}

class DFlexBaseElement {
  id: string;

  translate: PointNum;

  isPaused: boolean;

  private _hasAttribute?: AttributeSet;

  static getType(): string {
    return "base:element";
  }

  static transform = transform;

  static transition = transition;

  constructor(id: string) {
    this.id = id;
    this.isPaused = false;
    this.translate = new PointNum(0, 0);
    this._hasAttribute = new Set();
  }

  setAttribute(
    DOM: HTMLElement,
    key: AllowedAttributes,
    value: string | number
  ): void {
    if (key === "INDEX") {
      DOM.setAttribute(DFLEX_ATTRIBUTES[key], `${value}`);

      return;
    }

    if (this._hasAttribute!.has(key)) {
      return;
    }

    DOM.setAttribute(DFLEX_ATTRIBUTES[key], `${value}`);
    this._hasAttribute!.add(key);
  }

  removeAttribute(DOM: HTMLElement, key: AllowedAttributes): void {
    if (key === "INDEX" || !this._hasAttribute!.has(key)) {
      return;
    }

    DOM.removeAttribute(DFLEX_ATTRIBUTES[key]);
    this._hasAttribute!.delete(key);
  }

  clearAttributes(DOM: HTMLElement): void {
    this._hasAttribute!.forEach((key) => {
      this.removeAttribute(DOM, key);
    });

    this._hasAttribute!.clear();
  }
}

export default DFlexBaseElement;
