import { AbstractDraggable } from "@dflex/draggable";
import type { DraggedStyle, Coordinates } from "@dflex/draggable";

import type { CoreInstanceInterface } from "@dflex/core-instance";

import store from "../DnDStore";

import type { DraggableDnDInterface, Restrictions, TempOffset } from "./types";

import type {
  ScrollOptWithThreshold,
  FinalDndOpts,
  RestrictionsStatus,
} from "../types";

import Threshold, { ThresholdMatrix } from "../Plugins/Threshold";

class Draggable
  extends AbstractDraggable<CoreInstanceInterface>
  implements DraggableDnDInterface
{
  private isLayoutStateUpdated: boolean;

  tempIndex: number;

  operationID: string;

  siblingsContainer: CoreInstanceInterface | null;

  isOutActiveSiblingsContainer: boolean;

  setOfTransformedIds?: Set<string>;

  threshold: DraggableDnDInterface["threshold"];

  layoutThresholds!: DraggableDnDInterface["layoutThresholds"];

  scroll: ScrollOptWithThreshold;

  isViewportRestricted: boolean;

  innerOffsetX: number;

  innerOffsetY: number;

  tempOffset: TempOffset;

  readonly occupiedOffset: TempOffset;

  readonly occupiedTranslate: Coordinates;

  prevY: number;

  numberOfElementsTransformed: number;

  isMovingDown: boolean;

  isOutPositionHorizontally: boolean;

  isOutSiblingsHorizontally: boolean;

  private axesFilterNeeded: boolean;

  private restrictions: Restrictions;

  private restrictionsStatus: RestrictionsStatus;

  private marginX: number;

  private initY: number;

  private initX: number;

  isDraggedPositionFixed: boolean;

  private changeToFixedStyleProps: DraggedStyle;

  constructor(id: string, initCoordinates: Coordinates, opts: FinalDndOpts) {
    const { element, parent } = store.getElmTreeById(id);

    super(element, initCoordinates);

    this.isLayoutStateUpdated = false;

    const { order } = element;

    /**
     * Initialize temp index that refers to element new position after
     * transformation happened.
     */
    this.tempIndex = order.self;

    // This tiny bug caused an override  options despite it's actually freezed!
    this.scroll = { ...opts.scroll };

    const { SK } = store.registry[id].keys;

    const { hasOverflowX, hasOverflowY } = store.siblingsScrollElement[SK];

    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

    this.isViewportRestricted = true;
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

    const siblingsBoundaries = store.siblingsBoundaries[SK];

    this.threshold = new Threshold(opts.threshold);

    const {
      offset: { width, height },
      currentPosition,
    } = this.draggedElm;

    this.threshold.updateElementThresholdMatrix(
      { width, height, left: currentPosition.x, top: currentPosition.y },
      false
    );

    if (siblings !== null) {
      /**
       * Thresholds store, contains max value for each parent and for dragged. Depending on
       * ids as keys.
       */
      this.layoutThresholds = {
        [SK]: this.threshold.getThresholdMatrix(
          siblingsBoundaries.top,
          siblingsBoundaries.maxLeft,
          siblingsBoundaries.bottom
        ),
      };
    }

    this.siblingsContainer = null;
    this.isOutActiveSiblingsContainer = false;

    if (parent) {
      /**
       * Indicator to parents that have changed. This facilitates looping in
       * affected parents only.
       */
      this.setOfTransformedIds = new Set([]);
      this.assignActiveParent(parent);

      this.isOutActiveSiblingsContainer = false;
    }

    this.operationID = store.tracker.newTravel();

    const { x, y } = initCoordinates;

    this.initY = y;
    this.initX = x;

    this.innerOffsetX = Math.round(x - this.draggedElm.currentPosition.x);
    this.innerOffsetY = Math.round(y - this.draggedElm.currentPosition.y);

    const style = window.getComputedStyle(this.draggedElm.ref!);

    // get element margin
    const rm = Math.round(parseFloat(style.marginRight));
    const lm = Math.round(parseFloat(style.marginLeft));
    this.marginX = rm + lm;

    this.tempOffset = {
      currentLeft: this.draggedElm.currentPosition.x,
      currentTop: this.draggedElm.currentPosition.y,
    };

    this.occupiedOffset = {
      currentLeft: this.draggedElm.currentPosition.x,
      currentTop: this.draggedElm.currentPosition.y,
    };

    this.occupiedTranslate = {
      x: this.draggedElm.translate.x,
      y: this.draggedElm.translate.y,
    };

    /**
     * previous X and Y are used to calculate mouse directions.
     */
    this.prevY = y;

    /**
     * It counts number of element that dragged has passed. This counter is
     * crucial to calculate drag's translate and index
     */
    this.numberOfElementsTransformed = 0;

    this.isMovingDown = false;

    this.isOutPositionHorizontally = false;
    this.isOutSiblingsHorizontally = false;

    this.restrictions = opts.restrictions;

    this.restrictionsStatus = opts.restrictionsStatus;

    this.axesFilterNeeded =
      siblings !== null &&
      (opts.restrictionsStatus.isContainerRestricted ||
        opts.restrictionsStatus.isSelfRestricted);
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

    /**
     * Add flag for undo method so we can check which  parent is being
     * transformed and which is not.
     */
    this.isOutActiveSiblingsContainer = false;
  }

  private axesYFilter(
    y: number,
    topThreshold: number,
    bottomThreshold: number,
    allowTop: boolean,
    allowBottom: boolean,
    isRestrictedToThreshold: boolean // if not. Then to self.
  ) {
    const currentTop = y - this.innerOffsetY;
    const currentBottom = currentTop + this.draggedElm.offset.height;

    if (!allowTop && currentTop <= topThreshold) {
      return isRestrictedToThreshold
        ? topThreshold + this.innerOffsetY
        : this.initY;
    }

    if (!allowBottom && currentBottom >= bottomThreshold) {
      return isRestrictedToThreshold
        ? bottomThreshold + this.innerOffsetY - this.draggedElm.offset.height
        : this.initY;
    }

    return y;
  }

  private axesXFilter(
    x: number,
    leftThreshold: number,
    rightThreshold: number,
    allowLeft: boolean,
    allowRight: boolean,
    restrictToThreshold: boolean // if not. Then to self.,
  ) {
    const currentLeft = x - this.innerOffsetX;
    const currentRight = currentLeft + this.draggedElm.offset.width;

    if (!allowLeft && currentLeft <= leftThreshold) {
      return restrictToThreshold
        ? leftThreshold + this.innerOffsetX
        : this.initX;
    }

    if (!allowRight && currentRight + this.marginX >= rightThreshold) {
      return restrictToThreshold
        ? rightThreshold +
            this.innerOffsetX -
            this.draggedElm.offset.width -
            this.marginX
        : this.initX;
    }

    return x;
  }

  private getLastElmIndex() {
    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

    return siblings!.length - 1;
  }

  private isFirstOrOutside() {
    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

    return siblings !== null && this.tempIndex <= 0;
  }

  private isLastELm() {
    return this.tempIndex === this.getLastElmIndex();
  }

  /**
   * Dragged current-offset is essential to determine dragged position in
   * layout and parent.
   *
   * Is it moved form its translate? Is it out the parent or in
   * another parent? The answer is related to currentOffset.
   *
   * Note: these are the current offset related only to the dragging. When the
   * operation is done, different calculation will be set.
   *
   * @param x -
   * @param y -
   */
  dragAt(x: number, y: number) {
    if (!this.isLayoutStateUpdated) {
      this.isLayoutStateUpdated = true;
      store.onStateChange("dragging");
    }

    let filteredY = y;
    let filteredX = x;

    const { SK } = store.registry[this.draggedElm.id].keys;

    if (this.axesFilterNeeded) {
      const { top, bottom, maxLeft, minRight } = store.siblingsBoundaries[SK];

      if (this.restrictionsStatus.isContainerRestricted) {
        filteredX = this.axesXFilter(
          x,
          maxLeft,
          minRight,
          this.restrictions.container.allowLeavingFromLeft,
          this.restrictions.container.allowLeavingFromRight,

          false
        );
        filteredY = this.axesYFilter(
          y,
          top,
          bottom,
          this.restrictions.container.allowLeavingFromTop,
          this.restrictions.container.allowLeavingFromBottom,
          true
        );
      } else if (this.restrictionsStatus.isSelfRestricted) {
        filteredX = this.axesXFilter(
          x,
          maxLeft,
          minRight,
          this.restrictions.self.allowLeavingFromLeft,
          this.restrictions.self.allowLeavingFromRight,
          false
        );
        filteredY = this.axesYFilter(
          y,
          this.draggedElm.currentPosition.y,
          this.draggedElm.currentPosition.y + this.draggedElm.offset.height,
          this.restrictions.self.allowLeavingFromTop,
          this.restrictions.self.allowLeavingFromBottom,
          false
        );
      }
    } else if (this.isViewportRestricted) {
      // TODO: Test the fix this when scroll is implemented.
      filteredX = this.axesXFilter(
        x,
        0,
        store.siblingsScrollElement[SK].getMaximumScrollContainerLeft(),
        false,
        false,
        true
      );
      filteredY = this.axesYFilter(
        y,
        0,
        store.siblingsScrollElement[SK].getMaximumScrollContainerTop(),
        false,
        false,
        true
      );
    }

    this.translate(filteredX, filteredY);

    /**
     * Every time we got new translate, offset should be updated
     */
    this.tempOffset.currentLeft = filteredX - this.innerOffsetX;
    this.tempOffset.currentTop = filteredY - this.innerOffsetY;
  }

  private isOutThresholdH($: ThresholdMatrix) {
    return (
      this.tempOffset.currentLeft < $.maxLeft ||
      this.tempOffset.currentLeft > $.maxRight
    );
  }

  private isOutPositionV($: ThresholdMatrix) {
    return this.isMovingDown
      ? this.tempOffset.currentTop > $.maxBottom
      : this.tempOffset.currentTop < $.maxTop;
  }

  private isOutContainerV($: ThresholdMatrix) {
    /**
     * Are you last element and outside the container? Or are you coming from top
     * and outside the container?
     */
    return (
      (this.isLastELm() && this.tempOffset.currentTop > $.maxBottom) ||
      (this.tempIndex < 0 && this.tempOffset.currentTop < $.maxTop)
    );
  }

  private isOutPosition($: ThresholdMatrix) {
    this.isOutPositionHorizontally = false;

    if (this.isOutThresholdH($)) {
      this.isOutPositionHorizontally = true;

      return true;
    }

    if (this.isOutPositionV($)) {
      return true;
    }

    return false;
  }

  private isOutContainer($: ThresholdMatrix) {
    this.isOutSiblingsHorizontally = false;

    if (this.isOutContainerV($)) {
      this.isOutSiblingsHorizontally = true;

      return true;
    }

    if (this.isOutThresholdH($)) {
      return true;
    }

    return false;
  }

  /**
   * Checks if dragged it out of its position or parent.
   *
   * @param siblingsK -
   */
  isOutThreshold(siblingsK?: string) {
    return siblingsK
      ? this.isOutContainer(this.layoutThresholds[siblingsK])
      : this.isOutPosition(this.threshold.thresholdMatrix);
  }

  /**
   * Checks if dragged is the first child and going up.
   */
  isLeavingFromTop() {
    return (
      this.isFirstOrOutside() &&
      !this.isOutSiblingsHorizontally &&
      !this.isMovingDown
    );
  }

  /**
   * Checks if dragged is the last child and going down.
   */
  isLeavingFromBottom() {
    const { SK } = store.registry[this.draggedElm.id].keys;

    return (
      this.isLastELm() &&
      this.isMovingDown &&
      this.isOutContainerV(this.layoutThresholds[SK])
    );
  }

  isNotSettled() {
    const { SK } = store.registry[this.draggedElm.id].keys;

    return (
      !this.isLeavingFromBottom() &&
      (this.isOutThreshold() || this.isOutThreshold(SK))
    );
  }

  /**
   * @param y -
   */
  setDraggedMovingDown(y: number) {
    if (this.prevY === y) return;

    this.isMovingDown = y > this.prevY;

    this.prevY = y;
  }

  incNumOfElementsTransformed(effectedElemDirection: number) {
    this.numberOfElementsTransformed += -1 * effectedElemDirection;
  }

  private hasMoved() {
    return (
      this.draggedElm.translate.x !== this.tempTranslate.x ||
      this.draggedElm.translate.y !== this.tempTranslate.y
    );
  }

  setDraggedTransformPosition(isFallback: boolean) {
    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

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

      if (this.hasMoved()) {
        this.draggedElm.transformElm();
        this.draggedElm.updateDataset(this.draggedElm.order.self);

        /**
         * There's a rare case where dragged leaves and returns to the same
         * position. In this case, undo won't be triggered so that we have to do
         * it manually here. Otherwise, undoing will handle repositioning. I
         * don't like it but it is what it is.
         */
        if (
          siblings &&
          siblings[this.draggedElm.order.self] !== this.draggedElm.id
        ) {
          this.draggedElm.assignNewPosition(
            siblings,
            this.draggedElm.order.self
          );
        }
      }

      return;
    }

    // this.draggedElm.resetIndicators(
    //   {
    //     x: this.occupiedOffset.currentLeft,
    //     y: this.occupiedOffset.currentTop,
    //   },
    //   {
    //     x: this.occupiedTranslate.x,
    //     y: this.occupiedTranslate.y,
    //   }
    // );

    // @ts-expect-error
    this.draggedElm.currentTop = this.occupiedOffset.currentTop;
    // @ts-expect-error
    this.draggedElm.currentLeft = this.occupiedOffset.currentLeft;

    this.draggedElm.currentPosition!.setAxes(
      this.occupiedOffset.currentLeft,
      this.occupiedOffset.currentTop
    );

    this.draggedElm.translate.x = this.occupiedTranslate.x;
    this.draggedElm.translate.y = this.occupiedTranslate.y;

    this.draggedElm.transformElm();

    if (siblings) {
      this.draggedElm.assignNewPosition(siblings, this.tempIndex);
    }

    this.draggedElm.order.self = this.tempIndex;
  }

  endDragging(isFallback: boolean) {
    this.setDragged(false);
    this.setDraggedTransformPosition(isFallback);

    if (this.isDraggedPositionFixed) {
      this.changeStyle(this.changeToFixedStyleProps, false);
    }
  }
}

export default Draggable;
