/* eslint-disable no-dupe-class-members */
/* eslint-disable no-unused-vars */
import { DFlexBaseElement } from "@dflex/core-instance";
import { PointNum, getSelection } from "@dflex/utils";
import type { AxesPoint } from "@dflex/utils";

function setMirrorStyle(
  mirrorStyle: CSSStyleDeclaration,
  viewportPos: [number, number] | null,
  dimensions: PointNum | null
): void {
  const [top = 0, left = 0] = viewportPos || [];

  mirrorStyle.setProperty("position", "fixed");
  mirrorStyle.setProperty("top", `${top}px`);
  mirrorStyle.setProperty("left", `${left}px`);

  if (dimensions) {
    if (dimensions.y > 0) {
      mirrorStyle.setProperty("height", `${dimensions.y}px`);
    }

    if (dimensions.x > 0) {
      mirrorStyle.setProperty("width", `${dimensions.x}px`);
    }
  }

  mirrorStyle.setProperty("z-index", "99");
  mirrorStyle.setProperty("margin", "0");
}

function setOrUnsetOriginStyle(
  originStyle: CSSStyleDeclaration,
  shouldSet: boolean
) {
  if (shouldSet) {
    originStyle.setProperty("position", "relative");
    originStyle.setProperty("z-index", "99");

    return;
  }

  originStyle.removeProperty("position");
  originStyle.removeProperty("z-index");
}

// function disableUserSelect(): void {
//   document.body.style.setProperty("user-select", "none");

//   const domSelection = getSelection();

//   if (domSelection) {
//     domSelection.removeAllRanges();
//   }
// }

// function restoreUserSelect() {
//   document.body.style.removeProperty("user-select");
// }

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

  private _restoreContentEditable: boolean;

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
    initCoordinates: AxesPoint
  ) {
    this.draggedElm = abstractCoreElm;
    this.draggedDOM = DOM;

    const { translate } = this.draggedElm;

    this._outerOffset = new PointNum(
      -initCoordinates.x + translate.x,
      -initCoordinates.y + translate.y
    );

    this.translatePlaceholder = new PointNum(0, 0);
    this._restoreContentEditable = false;
    this._preservedAriaDisabled = null;
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
    isMigratedInScroll: false,
    dimensions: PointNum,
    viewportPos: [number, number]
  ): void;

  protected setDOMAttrAndStyle(
    originDOM: HTMLElement,
    mirrorDOM: HTMLElement,
    isAddingProps: false,
    isMigratedInScroll: true,
    dimensions: PointNum,
    viewportPos: null
  ): void;

  protected setDOMAttrAndStyle(
    originDOM: HTMLElement,
    mirrorDOM: HTMLElement,
    isAddingProps: false,
    isMigratedInScroll: false,
    dimensions: null,
    viewportPos: null
  ): void;

  protected setDOMAttrAndStyle(
    originDOM: HTMLElement,
    mirrorDOM: null,
    isAddingProps: true,
    isMigratedInScroll: false,
    dimensions: null,
    viewportPos: null
  ): void;

  protected setDOMAttrAndStyle(
    originDOM: HTMLElement,
    mirrorDOM: null,
    isAddingProps: false,
    isMigratedInScroll: false,
    dimensions: null,
    viewportPos: null
  ): void;

  protected setDOMAttrAndStyle(
    originDOM: HTMLElement,
    mirrorDOM: HTMLElement | null,
    isAddingProps: boolean,
    isMigratedInScroll: boolean,
    dimensions: PointNum | null,
    viewportPos: [number, number] | null
  ): void {
    const { style: originStyle } = originDOM;

    if (isAddingProps) {
      this._preservedAriaDisabled = originDOM.ariaDisabled;
      originDOM.ariaDisabled = "true";
      this.draggedElm.setAttribute(originDOM, "DRAGGED", "true");

      if (mirrorDOM !== null) {
        mirrorDOM.ariaLabel = "Draggable";
        mirrorDOM.id = `dflex-draggable-mirror__${originDOM.id}`;
        delete mirrorDOM.dataset.index;

        setMirrorStyle(mirrorDOM.style, viewportPos, dimensions);

        originStyle.setProperty("opacity", "0");
        // mirrorStyle.backgroundColor = "red";
      } else {
        originDOM.ariaLabel = "Draggable";

        setOrUnsetOriginStyle(originStyle, true);
      }

      document.body.style.setProperty("user-select", "none");

      const domSelection = getSelection();

      if (domSelection) {
        domSelection.removeAllRanges();
      }

      return;
    }

    document.body.style.removeProperty("user-select");

    if (this._restoreContentEditable) {
      originDOM.contentEditable = "true";
    }

    originDOM.ariaLabel = null;
    originDOM.ariaDisabled = this._preservedAriaDisabled;
    this.draggedElm.clearAttributes(originDOM);

    if (mirrorDOM !== null) {
      if (isMigratedInScroll) {
        originStyle.setProperty("position", "absolute");
        if (dimensions!.x > 0) {
          originStyle.setProperty("width", `${dimensions!.x}px`);
        }
        if (dimensions!.y > 0) {
          originStyle.setProperty("height", `${dimensions!.y}px`);
        }
      }
      originStyle.removeProperty("opacity");
      mirrorDOM.remove();
    } else {
      setOrUnsetOriginStyle(originStyle, false);
    }

    if (!originDOM.getAttribute("style")) {
      originDOM.removeAttribute("style");
    }

    if (!document.body.getAttribute("style")) {
      document.body.removeAttribute("style");
    }
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
      y + this._outerOffset.y
    );

    DFlexBaseElement.transform(
      this.draggedDOM,
      this.translatePlaceholder.x,
      this.translatePlaceholder.y
    );
  }
}

export default DFlexBaseDraggable;
