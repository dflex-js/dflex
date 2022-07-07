import { Threshold } from "../Threshold";
import type { ThresholdPercentages } from "../Threshold";
import type { RectDimensions } from "../types";

// eslint-disable-next-line no-unused-vars
type ScrollEventCallback = (SK: string) => void;

const OVERFLOW_REGEX = /(auto|scroll|overlay)/;

function loopInDOM(
  fromElement: HTMLElement,
  // eslint-disable-next-line no-unused-vars
  cb: (arg: HTMLElement) => boolean
) {
  let current: HTMLElement | null = fromElement;

  do {
    if (cb(current)) {
      return current;
    }

    current = current.parentNode as HTMLElement;
  } while (current && !current.isSameNode(document.body));

  return null;
}

function isStaticallyPositioned(element: Element) {
  const computedStyle = getComputedStyle(element);
  const position = computedStyle.getPropertyValue("position");
  return position === "static";
}

class Scroll {
  threshold: Threshold | null;

  SK: string;

  scrollEventCallback: ScrollEventCallback | null;

  scrollX!: number;

  scrollY!: number;

  scrollRect: RectDimensions;

  scrollHeight!: number;

  scrollWidth!: number;

  hasOverflowX!: boolean;

  hasOverflowY!: boolean;

  allowDynamicVisibility!: boolean;

  DOM!: HTMLElement;

  hasThrottledFrame: number | null;

  hasDocumentAsContainer!: boolean;

  constructor(element: HTMLElement, SK: string) {
    this.threshold = null;
    this.hasThrottledFrame = null;

    this.scrollRect = {
      height: 0,
      width: 0,
      left: 0,
      top: 0,
    };

    this.SK = SK;

    this.DOM = this.getScrollContainer(element);

    this.setScrollRect();
    this.setScrollCoordinates();
    this.setScrollListener();
    this.scrollEventCallback = null;
  }

  private getScrollContainer(baseDOMElm: HTMLElement) {
    this.hasDocumentAsContainer = false;

    const baseComputedStyle = getComputedStyle(baseDOMElm);
    const baseELmPosition = baseComputedStyle.getPropertyValue("position");
    const excludeStaticParents = baseELmPosition === "absolute";

    const scrollContainer = loopInDOM(baseDOMElm, (parentDOM) => {
      if (excludeStaticParents && isStaticallyPositioned(parentDOM)) {
        return false;
      }

      const parentComputedStyle = getComputedStyle(parentDOM);

      const parentRect = parentDOM.getBoundingClientRect();

      const overflowY = parentComputedStyle.getPropertyValue("overflow-y");

      if (OVERFLOW_REGEX.test(overflowY)) {
        if (parentDOM.scrollHeight === Math.round(parentRect.height)) {
          this.hasDocumentAsContainer = true;
        }

        return true;
      }

      const overflowX = parentComputedStyle.getPropertyValue("overflow-x");

      if (OVERFLOW_REGEX.test(overflowX)) {
        if (parentDOM.scrollWidth === Math.round(parentRect.width)) {
          this.hasDocumentAsContainer = true;
        }

        return true;
      }

      return false;
    });

    if (
      this.hasDocumentAsContainer ||
      baseELmPosition === "fixed" ||
      !scrollContainer
    ) {
      this.hasDocumentAsContainer = true;

      return document.documentElement;
    }

    return scrollContainer;
  }

  private setScrollRect() {
    const { scrollHeight, scrollWidth } = this.DOM;

    this.scrollHeight = scrollHeight;
    this.scrollWidth = scrollWidth;

    if (this.hasDocumentAsContainer) {
      const viewportHeight = Math.max(
        this.DOM.clientHeight || 0,
        window.innerHeight || 0
      );

      const viewportWidth = Math.max(
        this.DOM.clientWidth || 0,
        window.innerWidth || 0
      );

      this.scrollRect = {
        height: viewportHeight,
        width: viewportWidth,
        left: 0,
        top: 0,
      };
    } else {
      const { height, width, left, top } = this.DOM.getBoundingClientRect();

      this.scrollRect = { height, width, left, top };
    }

    this.hasOverflowY = this.scrollHeight > this.scrollRect.height;
    this.hasOverflowX = this.scrollRect.width < scrollWidth;

    /**
     * Deciding when to active visibility and pausing for element branch. We
     * don't want to active a method with a listeners because just two elements
     * are not visible.
     */
    this.allowDynamicVisibility = false;

    if (this.hasOverflowY && scrollHeight / 2 >= this.scrollRect.height) {
      this.allowDynamicVisibility = true;

      return;
    }

    if (this.hasOverflowX && scrollWidth / 2 >= this.scrollRect.width) {
      this.allowDynamicVisibility = true;
    }
  }

  private setScrollListener(isAttachListener = true) {
    /**
     * No need to set scroll listener if there is no scroll.
     */
    const hasScrollListener = this.hasOverflowX || this.hasOverflowY;

    const type = isAttachListener ? "addEventListener" : "removeEventListener";

    const container = this.hasDocumentAsContainer ? window : this.DOM;

    const opts = { passive: true };

    container[type]("resize", this.animatedResizeListener, opts);

    if (hasScrollListener) {
      container[type]("scroll", this.animatedScrollListener, opts);

      let elm: HTMLElement = this.DOM;

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
    this.threshold.setMainThreshold(this.SK, this.scrollRect, true);
  }

  private setScrollCoordinates() {
    const scrollY = Math.round(this.DOM.scrollTop || window.pageYOffset);

    const scrollX = Math.round(this.DOM.scrollLeft || window.pageXOffset);

    const isUpdated = scrollY !== this.scrollY || scrollX !== this.scrollX;

    this.scrollY = scrollY;
    this.scrollX = scrollX;

    return isUpdated;
  }

  getMaximumScrollContainerLeft() {
    const { left, width } = this.scrollRect;

    return left + width + this.scrollX;
  }

  getMaximumScrollContainerTop() {
    const { top, height } = this.scrollRect;

    return top + height + this.scrollY;
  }

  isElementVisibleViewportX(currentLeft: number): boolean {
    return (
      currentLeft >= this.scrollX &&
      currentLeft <= this.getMaximumScrollContainerLeft()
    );
  }

  isElementVisibleViewportY(currentTop: number): boolean {
    return (
      currentTop >= this.scrollY &&
      currentTop <= this.getMaximumScrollContainerTop()
    );
  }

  private animatedListener(
    setter: "setScrollRect" | "setScrollCoordinates",
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
      "setScrollCoordinates",
      this.scrollEventCallback
    );
  };

  private animatedResizeListener = () => {
    this.animatedListener.call(this, "setScrollRect", null);
  };

  destroy() {
    this.setScrollListener(false);
    // @ts-expect-error
    this.DOM = null;
  }
}

export default Scroll;
