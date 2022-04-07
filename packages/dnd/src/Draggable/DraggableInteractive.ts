import type { DraggedStyle } from "@dflex/draggable";

import { PointNum } from "@dflex/utils";
import type { IPointNum, IPointAxes } from "@dflex/utils";

import type { CoreInstanceInterface } from "@dflex/core-instance";

import store from "../DnDStore";

import type { DraggableInteractiveInterface } from "./types";

import type { ScrollOptWithThreshold, FinalDndOpts } from "../types";

import DraggableAxes from "./DraggableAxes";

class DraggableInteractive
  extends DraggableAxes
  implements DraggableInteractiveInterface
{
  operationID: string;

  siblingsContainer: CoreInstanceInterface | null;

  setOfTransformedIds?: Set<string>;

  scroll: ScrollOptWithThreshold;

  occupiedPosition: IPointNum;

  occupiedTranslate: IPointNum;

  numberOfElementsTransformed: number;

  isDraggedPositionFixed: boolean;

  private changeToFixedStyleProps: DraggedStyle;

  constructor(id: string, initCoordinates: IPointAxes, opts: FinalDndOpts) {
    const { parent } = store.getElmTreeById(id);

    super(id, initCoordinates, opts);

    // This tiny bug caused an override  options despite it's actually freezed!
    this.scroll = { ...opts.scroll };

    const { SK } = store.registry[id].keys;

    const { hasOverflowX, hasOverflowY } = store.siblingsScrollElement[SK];

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

      store.siblingsScrollElement[SK].setThresholdMatrix(this.scroll.threshold);

      if (!store.siblingsScrollElement[SK].hasDocumentAsContainer) {
        /**
         * When the scroll is the document it's good. The restriction is to the
         * document which guarantees the free movement. Otherwise, let's do it.
         * Change the position and transform siblings.
         */
        // this.isDraggedPositionFixed = true;
      }
    }

    const { currentPosition, translate } = this.draggedElm;

    this.siblingsContainer = null;

    if (parent) {
      /**
       * Indicator to parents that have changed. This facilitates looping in
       * affected parents only.
       */
      this.setOfTransformedIds = new Set([]);
      this.assignActiveParent(parent);
    }

    this.operationID = store.tracker.newTravel();

    this.occupiedPosition = new PointNum(currentPosition.x, currentPosition.y);
    this.occupiedTranslate = new PointNum(translate.x, translate.y);

    /**
     * It counts number of element that dragged has passed. This counter is
     * crucial to calculate drag's translate and index
     */
    this.numberOfElementsTransformed = 0;
  }

  /**
   * Assigns new container parent to the dragged.
   *
   * @param element -
   */
  private assignActiveParent(element: CoreInstanceInterface) {
    /**
     * Assign a new instance which represents droppable. Then
     * assign owner parent so we have from/to.
     */
    this.siblingsContainer = element;
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

  assignSyntheticPosition(position: IPointNum) {
    const { threshold, occupiedPosition, draggedElm } = this;

    /**
     * Update threshold from here since there's no calling to updateElement.
     */
    threshold.setMainThreshold(draggedElm.id, {
      width: draggedElm.offset.width,
      height: draggedElm.offset.height,
      left: position.x,
      top: position.y,
    });

    occupiedPosition.clone(position);
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
