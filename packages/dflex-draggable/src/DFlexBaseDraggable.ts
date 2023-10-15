/* eslint-disable no-dupe-class-members */
/* eslint-disable no-unused-vars */
import { DFlexBaseElement } from "@dflex/core-instance";
import {
  PointNum,
  getSelection,
  removeStyleProperty,
  setStyleProperty,
  updateDOMAttr,
} from "@dflex/utils";
import type { AxesPoint } from "@dflex/utils";

const MIRROR_ID_PREFIX = "dflex-draggable-mirror";

function updatedDraggedAttr(originDOM: HTMLElement, isRemove: boolean): void {
  updateDOMAttr(originDOM, "dragged", isRemove, false);
}

function setMirrorStyle(
  mirrorDOM: HTMLElement,
  viewportPos: [number, number] | null,
  dimensions: PointNum | null,
): void {
  const [top = 0, left = 0] = viewportPos || [];

  setStyleProperty(mirrorDOM, "position", "fixed");
  setStyleProperty(mirrorDOM, "top", `${top}px`);
  setStyleProperty(mirrorDOM, "left", `${left}px`);

  if (dimensions) {
    if (dimensions.y > 0) {
      setStyleProperty(mirrorDOM, "height", `${dimensions.y}px`);
    }

    if (dimensions.x > 0) {
      setStyleProperty(mirrorDOM, "width", `${dimensions.x}px`);
    }
  }

  setStyleProperty(mirrorDOM, "z-index", "99");
  setStyleProperty(mirrorDOM, "margin", "0");
}

function setOrUnsetOriginStyle(originDOM: HTMLElement, shouldSet: boolean) {
  if (shouldSet) {
    setStyleProperty(originDOM, "position", "relative");
    setStyleProperty(originDOM, "z-index", "99");
  } else {
    removeStyleProperty(originDOM, "position");
    removeStyleProperty(originDOM, "z-index");
  }
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

class DFlexBaseDraggable<T extends DFlexBaseElement> {
  draggedElm: T;

  draggedDOM: HTMLElement;

  /**
   * When dragging start, element shouldn't jump from its translate. So, we
   * calculate offset that make translate X,Y start from zero:
   *  goToX = x + this.outerOffsetX.
   *  goToY = y + this.outerOffsetY.
   *
   * goToX and goToY both should be zero with first click. Starts with simple
   * equating: initX = X. Taking into considerations translate value.
   *
   */
  private _outerOffset: PointNum;

  private _preservedAriaDisabled: string | null;

  protected translatePlaceholder: PointNum;

  /**
   * Creates an instance of AbstractDraggable.
   * Works Only on dragged element level.
   *
   * @param abstractCoreElm -
   * @param DOM -
   * @param initCoordinates -
   */
  constructor(
    abstractCoreElm: T,
    DOM: HTMLElement,
    initCoordinates: AxesPoint,
  ) {
    this.draggedElm = abstractCoreElm;
    this.draggedDOM = DOM;

    const { translate } = this.draggedElm;

    this._outerOffset = new PointNum(
      translate.x - initCoordinates.x,
      translate.y - initCoordinates.y,
    );

    this.translatePlaceholder = new PointNum(0, 0);

    this._preservedAriaDisabled = null;
  }

  private _preserveDOMAttributes(DOM: HTMLElement, shouldSet: boolean): void {
    if (shouldSet) {
      this._preservedAriaDisabled = DOM.ariaDisabled;

      DOM.ariaDisabled = "true";

      return;
    }

    DOM.ariaDisabled = this._preservedAriaDisabled;
  }

  /**
   *
   * @param originDOM
   * @param mirrorDOM
   * @param isAddingProps
   * @param dimensions
   * @param viewportPos
   * @returns
   */
  protected setDOMAttrAndStyle(
    originDOM: HTMLElement,
    mirrorDOM: HTMLElement,
    isAddingProps: true,
    dimensions: PointNum,
    viewportPos: [number, number],
  ): void;

  protected setDOMAttrAndStyle(
    originDOM: HTMLElement,
    mirrorDOM: null,
    isAddingProps: true,
    dimensions: null,
    viewportPos: null,
  ): void;

  protected setDOMAttrAndStyle(
    originDOM: HTMLElement,
    mirrorDOM: HTMLElement,
    isAddingProps: false,
    dimensions: null,
    viewportPos: null,
  ): void;

  protected setDOMAttrAndStyle(
    originDOM: HTMLElement,
    mirrorDOM: null,
    isAddingProps: false,
    dimensions: null,
    viewportPos: null,
  ): void;

  protected setDOMAttrAndStyle(
    originDOM: HTMLElement,
    mirrorDOM: HTMLElement | null,
    isAddingProps: boolean,
    dimensions: PointNum | null,
    viewportPos: [number, number] | null,
  ): void {
    if (isAddingProps) {
      this._preserveDOMAttributes(originDOM, true);

      updatedDraggedAttr(originDOM, false);

      if (mirrorDOM !== null) {
        mirrorDOM.ariaLabel = "Draggable";

        mirrorDOM.id = `${MIRROR_ID_PREFIX}_${originDOM.id}`;

        delete mirrorDOM.dataset.index;

        setMirrorStyle(mirrorDOM, viewportPos, dimensions);

        setStyleProperty(originDOM, "opacity", "0");
      } else {
        originDOM.ariaLabel = "Draggable";

        setOrUnsetOriginStyle(originDOM, true);
      }

      setStyleProperty(document.body, "user-select", "none");

      const domSelection = getSelection();

      if (domSelection) {
        domSelection.removeAllRanges();
      }

      return;
    }

    removeStyleProperty(document.body, "user-select");

    this._preserveDOMAttributes(originDOM, false);

    originDOM.ariaLabel = null;

    updatedDraggedAttr(originDOM, true);

    if (mirrorDOM !== null) {
      removeStyleProperty(originDOM, "opacity");

      mirrorDOM.remove();
    } else {
      setOrUnsetOriginStyle(originDOM, false);
    }

    rmEmptyAttr(originDOM, "style");
    rmEmptyAttr(document.body, "style");
  }

  /**
   * Executes dragging by applying transform.
   * Writes to draggedElmCurrentOffset in Transform class.
   * Set values to isDragged flags.
   *
   * @param x - mouse x coordinates
   * @param y - mouse y coordinates
   */
  protected translate(x: number, y: number) {
    /**
     * Calculates translate coordinates.
     *
     * Indicates dragged y-transformation that's will be updated during the
     * dropping process. Updating Y immediately will effect calculations in
     * transform, that's why it is updated when dragging is done.
     */
    this.translatePlaceholder.setAxes(
      x + this._outerOffset.x,
      y + this._outerOffset.y,
    );

    DFlexBaseElement.transform(
      this.draggedDOM,
      this.translatePlaceholder.x,
      this.translatePlaceholder.y,
    );
  }
}

export default DFlexBaseDraggable;
