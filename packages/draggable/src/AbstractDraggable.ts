import type { AbstractCoreInterface } from "@dflex/core-instance";

import type {
  AbstractDraggableInterface,
  DraggedStyle,
  Coordinates,
} from "./types";

class AbstractDraggable<T extends AbstractCoreInterface>
  implements AbstractDraggableInterface<T>
{
  draggedElm: T;

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
  outerOffsetX: number;

  outerOffsetY: number;

  tempTranslate: Coordinates;

  static draggedStyle: DraggedStyle = [
    {
      prop: "position",
      dragValue: "relative",
      afterDragValue: "",
    },
    {
      prop: "zIndex",
      dragValue: "99",
      afterDragValue: "",
    },
    {
      prop: "user-select",
      dragValue: "none",
      afterDragValue: "",
    },
  ];

  /**
   * Creates an instance of AbstractDraggable.
   * Works Only on dragged element level.
   *
   * @param abstractCoreElm -
   * @param initCoordinates -
   */
  constructor(abstractCoreElm: T, { x: initX, y: initY }: Coordinates) {
    /**
     * Assign instance for dragged.
     */

    this.draggedElm = abstractCoreElm;

    const { translate } = this.draggedElm;

    this.outerOffsetX = -initX + translate!.x;
    this.outerOffsetY = -initY + translate!.y;

    this.tempTranslate = {
      x: 0,
      y: 0,
    };

    this.setDragged(true);
  }

  changeStyle(style: DraggedStyle, shouldAddPosition: boolean) {
    if (shouldAddPosition) {
      style.forEach(({ prop, dragValue }) => {
        // TODO: Fix TS error.
        // @ts-expect-error.
        this.draggedElm.ref!.style[prop] = dragValue;
      });

      return;
    }

    style.forEach(({ prop, afterDragValue }) => {
      // TODO: Fix TS error.
      // @ts-expect-error.
      this.draggedElm.ref!.style[prop] = afterDragValue;
    });
  }

  /**
   * Triggers twice. Once when constructor is initiated, the other when drag is
   * ended. It adds/removes style.
   *
   * @param isActive - is dragged operation active or it is ended.
   */
  protected setDragged(isActive: boolean) {
    if (isActive) {
      this.changeStyle(AbstractDraggable.draggedStyle, true);

      if (getSelection()) {
        getSelection()!.removeAllRanges();
      }

      this.draggedElm.setAttribute("dragged", "true");

      return;
    }
    /**
     * Not active: end of dragging.
     */
    this.changeStyle(AbstractDraggable.draggedStyle, false);

    this.draggedElm.removeAttribute("dragged");
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
    this.tempTranslate.x = x + this.outerOffsetX;
    this.tempTranslate.y = y + this.outerOffsetY;

    this.draggedElm.transform(this.tempTranslate.x, this.tempTranslate.y);
  }
}

export default AbstractDraggable;
