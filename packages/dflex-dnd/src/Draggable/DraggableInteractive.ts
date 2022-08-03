import type { DraggedStyle } from "@dflex/draggable";

import { PointNum } from "@dflex/utils";
import type { AxesPoint } from "@dflex/utils";

import { store } from "../LayoutManager";

import type { ScrollOpts, FinalDndOpts } from "../types";

import DraggableAxes from "./DraggableAxes";

class DraggableInteractive extends DraggableAxes {
  scroll: ScrollOpts;

  occupiedPosition: PointNum;

  occupiedTranslate: PointNum;

  isDraggedPositionFixed: boolean;

  private changeToFixedStyleProps: DraggedStyle;

  constructor(id: string, initCoordinates: AxesPoint, opts: FinalDndOpts) {
    super(id, initCoordinates, opts);

    this.scroll = { ...opts.scroll };

    const scroll = store.getScrollByID(id);

    const { hasOverflow } = scroll;

    const siblings = store.getElmBranchByKey(this.migration.latest().SK);

    this.isDraggedPositionFixed = false;

    this.changeToFixedStyleProps = [
      {
        prop: "top",
        dragValue: `${this.draggedElm.currentPosition.y}px`,
        afterDragValue: "",
      },
      {
        prop: "left",
        dragValue: `${this.draggedElm.currentPosition.x}px`,
        afterDragValue: "",
      },
      {
        prop: "position",
        dragValue: "fixed",
        afterDragValue: "",
      },
    ];

    // Override the default options When no siblings or no overflow.
    if (siblings.length <= 1 || hasOverflow.isAllFalsy()) {
      this.scroll.enable = false;
    }

    if (this.scroll.enable) {
      this.isViewportRestricted = false;

      scroll.setInnerThreshold(this.scroll.threshold);

      if (!scroll.hasDocumentAsContainer) {
        /**
         * When the scroll is the document it's good. The restriction is to the
         * document which guarantees the free movement. Otherwise, let's do it.
         * Change the position and transform siblings.
         */
        // this.isDraggedPositionFixed = true;
      }
    }

    const { currentPosition, translate } = this.draggedElm;

    this.occupiedPosition = new PointNum(currentPosition.x, currentPosition.y);
    this.occupiedTranslate = new PointNum(translate.x, translate.y);
  }

  setDraggedTempIndex(i: number) {
    if (!Number.isNaN(i)) {
      this.migration.setIndex(i);
    }

    this.draggedElm.setAttribute(this.draggedDOM, "INDEX", i);
  }

  setDraggedTransformPosition(isFallback: boolean) {
    const siblings = store.getElmBranchByKey(this.migration.latest().SK);

    const hasToUndo =
      isFallback ||
      // dragged in position but has been clicked.
      this.occupiedPosition.isInstanceEqual(this.draggedElm.currentPosition);

    if (hasToUndo) {
      /**
       * If not isDraggedOutPosition, it means dragged is out its position, inside
       * list but didn't reach another element to replace.
       *
       * List's elements is in their position, just undo dragged.
       *
       * Restore dragged position (translateX, translateY) directly. Why? Because,
       * dragged depends on extra instance to float in layout that is not related to element
       * instance.
       */
      if (
        !this.draggedElm.translate.isInstanceEqual(this.translatePlaceholder)
      ) {
        this.draggedElm.transform(this.draggedDOM);
        this.draggedElm.setAttribute(
          this.draggedDOM,
          "INDEX",
          this.draggedElm.order.self
        );

        /**
         * There's a rare case where dragged leaves and returns to the same
         * position. In this case, undo won't be triggered so that we have to do
         * it manually here. Otherwise, undoing will handle repositioning. I
         * don't like it but it is what it is.
         */
        if (siblings[this.draggedElm.order.self] !== this.draggedElm.id) {
          this.draggedElm.assignNewPosition(
            siblings,
            this.draggedElm.order.self
          );
        }
      }

      return;
    }

    this.draggedElm.currentPosition.clone(this.occupiedPosition);
    this.draggedElm.translate.clone(this.occupiedTranslate);

    this.draggedElm.grid.clone(this.gridPlaceholder);

    this.draggedElm.transform(this.draggedDOM);

    this.draggedElm.assignNewPosition(siblings, this.migration.latest().index);

    this.draggedElm.order.self = this.migration.latest().index;
  }

  endDragging(isFallback: boolean) {
    this.setDragged(false);
    this.setDraggedTransformPosition(isFallback);

    if (isFallback) this.migration.dispose();

    if (this.isDraggedPositionFixed) {
      this.changeStyle(this.changeToFixedStyleProps, false);
    }

    this.appendDraggedToContainerDimensions(false);

    this.threshold.destroy();
  }
}

export default DraggableInteractive;
