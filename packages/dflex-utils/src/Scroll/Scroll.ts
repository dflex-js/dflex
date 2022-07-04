import { Threshold } from "../Threshold";
import type { ThresholdPercentages } from "../Threshold";
import type { RectDimensions } from "../types";
import { getParentElm } from "../dom";

// eslint-disable-next-line no-unused-vars
type ScrollEventCallback = (SK: string) => void;

const OVERFLOW_REGEX = /(auto|scroll|overlay)/;

function isStaticallyPositioned(DOM: Element) {
  const computedStyle = getComputedStyle(DOM);
  const position = computedStyle.getPropertyValue("position");
  return position === "static";
}

function getScrollContainer(baseDOMElm: HTMLElement): [HTMLElement, boolean] {
  let hasDocumentAsContainer = false;

  const baseComputedStyle = getComputedStyle(baseDOMElm);
  const baseELmPosition = baseComputedStyle.getPropertyValue("position");
  const excludeStaticParents = baseELmPosition === "absolute";

  let scrollDOM: HTMLElement | null = null;

  getParentElm(baseDOMElm, (parentDOM) => {
    if (excludeStaticParents && isStaticallyPositioned(parentDOM)) {
      return false;
    }

    scrollDOM = parentDOM;

    const parentComputedStyle = getComputedStyle(parentDOM);

    const parentRect = parentDOM.getBoundingClientRect();

    const overflowY = parentComputedStyle.getPropertyValue("overflow-y");

    if (OVERFLOW_REGEX.test(overflowY)) {
      if (parentDOM.scrollHeight === Math.round(parentRect.height)) {
        hasDocumentAsContainer = true;
      }

      return true;
    }

    const overflowX = parentComputedStyle.getPropertyValue("overflow-x");

    if (OVERFLOW_REGEX.test(overflowX)) {
      if (parentDOM.scrollWidth === Math.round(parentRect.width)) {
        hasDocumentAsContainer = true;
      }

      return true;
    }

    return false;
  });

  if (hasDocumentAsContainer || baseELmPosition === "fixed" || !scrollDOM) {
    hasDocumentAsContainer = true;

    return [document.documentElement, true];
  }

  return [scrollDOM, hasDocumentAsContainer];
}

function widthOrHeight(direction: "x" | "y") {
  return direction === "x" ? "width" : "height";
}

function hasOverFlow(
  scrollRect: RectDimensions,
  scrollContainerRect: RectDimensions,
  direction: "x" | "y"
) {
  const dir = widthOrHeight(direction);

  return scrollRect[dir] > scrollContainerRect[dir];
}

function hasMoreThanHalfOverFlow(
  scrollRect: RectDimensions,
  scrollContainerRect: RectDimensions,
  direction: "x" | "y"
) {
  const dir = widthOrHeight(direction);

  return scrollRect[dir] / 2 > scrollContainerRect[dir];
}

class Scroll {
  threshold: Threshold | null;

  SK: string;

  scrollEventCallback: ScrollEventCallback | null;

  scrollContainerRect!: RectDimensions;

  scrollRect!: RectDimensions;

  hasOverflowX!: boolean;

  hasOverflowY!: boolean;

  allowDynamicVisibility!: boolean;

  scrollContainerDOM!: HTMLElement;

  hasThrottledFrame: number | null;

  hasDocumentAsContainer!: boolean;

  constructor(element: HTMLElement, SK: string) {
    this.threshold = null;
    this.hasThrottledFrame = null;
    this.SK = SK;

    [this.scrollContainerDOM, this.hasDocumentAsContainer] =
      getScrollContainer(element);

    this._setRectsWithOverflow();

    this.setScrollListener();
    this.scrollEventCallback = null;
  }

  private _setRectsWithOverflow(): void {
    const { scrollHeight, scrollWidth, scrollLeft, scrollTop } =
      this.scrollContainerDOM;

    this.scrollRect = {
      left: Math.round(scrollLeft),
      top: Math.round(scrollTop),
      width: scrollWidth,
      height: scrollHeight,
    };

    if (!this.hasDocumentAsContainer) {
      const { height, width, left, top } =
        this.scrollContainerDOM.getBoundingClientRect();

      // @ts-ignore
      this.scrollContainerRect = { height, width, left, top };
    } else {
      const viewportHeight = Math.max(
        this.scrollContainerDOM.clientHeight || 0,
        window.innerHeight || 0
      );

      const viewportWidth = Math.max(
        this.scrollContainerDOM.clientWidth || 0,
        window.innerWidth || 0
      );

      // @ts-ignore
      this.scrollContainerRect = {
        height: viewportHeight,
        width: viewportWidth,
        left: 0,
        top: 0,
      };
    }

    this._setOverflow();
  }

  private _setOverflow(): void {
    this.hasOverflowY = hasOverFlow(
      this.scrollRect,
      this.scrollContainerRect,
      "y"
    );

    this.hasOverflowX = hasOverFlow(
      this.scrollRect,
      this.scrollContainerRect,
      "x"
    );

    /**
     * Deciding when to active visibility and pausing for element branch. We
     * don't want to active a method with a listeners because just two elements
     * are not visible.
     */
    this.allowDynamicVisibility = false;

    if (
      this.hasOverflowY &&
      hasMoreThanHalfOverFlow(this.scrollRect, this.scrollContainerRect, "y")
    ) {
      this.allowDynamicVisibility = true;

      return;
    }

    if (
      this.hasOverflowX &&
      hasMoreThanHalfOverFlow(this.scrollRect, this.scrollContainerRect, "x")
    ) {
      this.allowDynamicVisibility = true;
    }
  }

  private _updateScrollCoordinates(): boolean {
    const scrollY = Math.round(this.scrollContainerDOM.scrollTop);
    const scrollX = Math.round(this.scrollContainerDOM.scrollLeft);

    const isUpdated =
      scrollY !== this.scrollRect.height || scrollX !== this.scrollRect.left;

    this.scrollRect.height = scrollY;
    this.scrollRect.width = scrollX;

    return isUpdated;
  }

  private setScrollListener(isAttachListener = true) {
    /**
     * No need to set scroll listener if there is no scroll.
     */
    const hasScrollListener = this.hasOverflowX || this.hasOverflowY;

    const type = isAttachListener ? "addEventListener" : "removeEventListener";

    const container = this.hasDocumentAsContainer
      ? window
      : this.scrollContainerDOM;

    const opts = { passive: true };

    container[type]("resize", this.animatedResizeListener, opts);

    if (hasScrollListener) {
      container[type]("scroll", this.animatedScrollListener, opts);

      let elm: HTMLElement = this.scrollContainerDOM;

      if (this.hasDocumentAsContainer) {
        // Find the first div in the document body.
        for (let i = 0; i < document.body.childNodes.length; i += 1) {
          if (
            document.body.childNodes[i].ELEMENT_NODE === 1 &&
            document.body.childNodes[i].nodeName === "DIV"
          ) {
            // @ts-expect-error
            elm = document.body.childNodes[i];

            break;
          }
        }
      }

      if (elm) {
        if (isAttachListener) {
          elm.dataset[
            `dflexScrollListener-${this.SK}`
          ] = `${this.allowDynamicVisibility}`;

          return;
        }

        delete elm.dataset.dflexScrollListener;

        return;
      }

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(
          `DFlex: Failed to add scroll listener dataset. Unable to detect the first valid div inside document.body`
        );
      }
    }
  }

  setThresholdMatrix(threshold: ThresholdPercentages) {
    this.threshold = new Threshold(threshold);
    this.threshold.setScrollThreshold(this.SK, this.scrollContainerRect);
  }

  getMaximumScrollContainerLeft() {
    const { left, width } = this.scrollContainerRect;

    return left + width + this.scrollRect.left;
  }

  getMaximumScrollContainerTop() {
    const { top, height } = this.scrollContainerRect;

    return top + height + this.scrollRect.top;
  }

  isElementVisibleViewportX(currentLeft: number): boolean {
    return (
      currentLeft >= this.scrollRect.left &&
      currentLeft <= this.getMaximumScrollContainerLeft()
    );
  }

  isElementVisibleViewportY(currentTop: number): boolean {
    return (
      currentTop >= this.scrollRect.top &&
      currentTop <= this.getMaximumScrollContainerTop()
    );
  }

  private animatedListener(
    setter: "_setRectsWithOverflow" | "_updateScrollCoordinates",
    cb: ScrollEventCallback | null
  ) {
    if (this.hasThrottledFrame !== null) return;

    this.hasThrottledFrame = window.requestAnimationFrame(() => {
      const isUpdated = this[setter]();

      if (isUpdated && cb) {
        cb(this.SK);
      }
      this.hasThrottledFrame = null;
    });
  }

  private animatedScrollListener = () => {
    this.animatedListener.call(
      this,
      "_updateScrollCoordinates",
      this.scrollEventCallback
    );
  };

  private animatedResizeListener = () => {
    this.animatedListener.call(this, "_setRectsWithOverflow", null);
  };

  destroy() {
    this.setScrollListener(false);
    // @ts-expect-error
    this.scrollContainerDOM = null;
  }
}

export default Scroll;
