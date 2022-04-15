import type { DraggedStyle } from "@dflex/draggable";

import { PointNum } from "@dflex/utils";
import type { IPointNum, IPointAxes } from "@dflex/utils";

import store from "../DnDStore";

import type { IDraggableInteractive } from "./types";

import type { ScrollOptWithThreshold, FinalDndOpts } from "../types";

import DraggableAxes from "./DraggableAxes";

class DraggableInteractive
  extends DraggableAxes
  implements IDraggableInteractive
{
  operationID: string;

  setOfTransformedIds?: Set<string>;

  scroll: ScrollOptWithThreshold;

  occupiedPosition: IPointNum;

  occupiedTranslate: IPointNum;

  numberOfElementsTransformed: number;

  isDraggedPositionFixed: boolean;

  private changeToFixedStyleProps: DraggedStyle;

  constructor(id: string, initCoordinates: IPointAxes, opts: FinalDndOpts) {
    super(id, initCoordinates, opts);

    this.scroll = { ...opts.scroll };

    const { SK } = store.registry[id].keys;

    const { hasOverflowX, hasOverflowY } = store.containers[SK].scroll;

    const siblings = store.getElmBranchByKey(this.migration.latest().key);

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

    if (siblings === null || (!hasOverflowY && !hasOverflowX)) {
      // Override the default options. (FYI, this is the only privilege I have.)
      this.scroll.enable = false;
    }

    if (this.scroll.enable) {
      this.isViewportRestricted = false;

      store.containers[SK].scroll.setThresholdMatrix(this.scroll.threshold);

      if (!store.containers[SK].scroll.hasDocumentAsContainer) {
        /**
         * When the scroll is the document it's good. The restriction is to the
         * document which guarantees the free movement. Otherwise, let's do it.
         * Change the position and transform siblings.
         */
        // this.isDraggedPositionFixed = true;
      }
    }

    const { currentPosition, translate } = this.draggedElm;

    this.operationID = store.tracker.newTravel();

    this.occupiedPosition = new PointNum(currentPosition.x, currentPosition.y);
    this.occupiedTranslate = new PointNum(translate.x, translate.y);

    /**
     * It counts number of element that dragged has passed. This counter is
     * crucial to calculate drag's translate and index
     */
    this.numberOfElementsTransformed = 0;
  }

  setDraggedTempIndex(i: number) {
    if (!Number.isNaN(i)) {
      this.migration.setIndex(i);
    }

    this.draggedElm.setDataset("index", i);
  }

  updateNumOfElementsTransformed(effectedElemDirection: number) {
    this.numberOfElementsTransformed += -1 * effectedElemDirection;
  }

  setDraggedTransformPosition(isFallback: boolean) {
    const siblings = store.getElmBranchByKey(this.migration.latest().key);

    /**
     * In this case, the use clicked without making any move.
     */
    if (
      isFallback ||
      siblings === null ||
      this.numberOfElementsTransformed === 0
    ) {
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
      if (!this.draggedElm.translate.isEqual(this.translatePlaceholder)) {
        this.draggedElm.transformElm();
        this.draggedElm.setDataset("index", this.draggedElm.order.self);

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

    // debugger;
    this.draggedElm.grid.clone(this.gridPlaceholder);

    // TODO: Fix this please, why it's just Y.
    this.draggedElm.setDataset("gridY", this.draggedElm.grid.y);

    this.draggedElm.transformElm();

    this.draggedElm.assignNewPosition(siblings, this.migration.latest().index);

    this.draggedElm.order.self = this.migration.latest().index;
  }

  endDragging(isFallback: boolean) {
    this.setDragged(false);
    this.setDraggedTransformPosition(isFallback);

    if (this.isDraggedPositionFixed) {
      this.changeStyle(this.changeToFixedStyleProps, false);
    }

    this.threshold.destroy();

    // TODO: add type to this.
    const properties = [
      "threshold",
      "gridPlaceholder",
      "isMovingAwayFrom",
      "positionPlaceholder",
      "occupiedOffset",
      "occupiedTranslate",
      "#initCoordinates",
    ];

    properties.forEach((property) => {
      // @ts-expect-error
      this[property] = null;
    });
  }
}

export default DraggableInteractive;
