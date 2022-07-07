import { DFlexBaseNode } from "@dflex/core-instance";
import { PointNum, getSelection } from "@dflex/utils";
import type { IPointNum, IPointAxes } from "@dflex/utils";

export type DraggedStyle = Array<{
  prop: string;
  dragValue: string;
  afterDragValue: string | null;
}>;

class DFlexBaseDraggable<T extends DFlexBaseNode> {
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
  outerOffset: IPointNum;

  translatePlaceholder: IPointNum;

  static draggedStyle: DraggedStyle = [
    {
      prop: "position",
      dragValue: "relative",
      afterDragValue: "",
    },
    {
      prop: "z-index",
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
   * @param DOM -
   * @param initCoordinates -
   */
  constructor(
    abstractCoreElm: T,
    DOM: HTMLElement,
    { x: initX, y: initY }: IPointAxes
  ) {
    this.draggedElm = abstractCoreElm;
    this.draggedDOM = DOM;

    const { translate } = this.draggedElm;

    this.outerOffset = new PointNum(-initX + translate.x, -initY + translate.y);

    this.translatePlaceholder = new PointNum(0, 0);

    this.setDragged(true);
  }

  changeStyle(style: DraggedStyle, shouldAddPosition: boolean) {
    if (shouldAddPosition) {
      style.forEach(({ prop, dragValue }) => {
        this.draggedDOM.style.setProperty(prop, dragValue);
      });

      return;
    }

    style.forEach(({ prop, afterDragValue }) => {
      this.draggedDOM.style.setProperty(prop, afterDragValue);
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
      this.changeStyle(DFlexBaseDraggable.draggedStyle, true);

      const domSelection = getSelection();

      if (domSelection) {
        domSelection.removeAllRanges();
      }

      this.draggedElm.setAttribute(this.draggedDOM, "DRAGGED", "true");

      return;
    }
    /**
     * Not active: end of dragging.
     */
    this.changeStyle(DFlexBaseDraggable.draggedStyle, false);

    this.draggedElm.clearAttributes(this.draggedDOM);
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
      x + this.outerOffset.x,
      y + this.outerOffset.y
    );

    DFlexBaseNode.transform(
      this.draggedDOM,
      this.translatePlaceholder.x,
      this.translatePlaceholder.y
    );
  }
}

export default DFlexBaseDraggable;
