import { AbstractDraggable } from "@dflex/draggable";
import type { DraggedStyle, Coordinates } from "@dflex/draggable";

import { AxesCoordinates } from "@dflex/utils";
import type { Axes, AxesCoordinatesInterface } from "@dflex/utils";

import type { CoreInstanceInterface } from "@dflex/core-instance";

import store from "../DnDStore";

import type { DraggableDnDInterface, Restrictions } from "./types";

import type {
  ScrollOptWithThreshold,
  FinalDndOpts,
  RestrictionsStatus,
} from "../types";

import Threshold, { ThresholdCoordinate } from "../Plugins/Threshold";

class Draggable
  extends AbstractDraggable<CoreInstanceInterface>
  implements DraggableDnDInterface
{
  private isLayoutStateUpdated: boolean;

  indexPlaceholder: number;

  operationID: string;

  siblingsContainer: CoreInstanceInterface | null;

  isOutActiveSiblingsContainer: boolean;

  setOfTransformedIds?: Set<string>;

  threshold: DraggableDnDInterface["threshold"];

  layoutThresholds!: DraggableDnDInterface["layoutThresholds"];

  scroll: ScrollOptWithThreshold;

  isViewportRestricted: boolean;

  innerOffset: AxesCoordinatesInterface;

  offsetPlaceholder: AxesCoordinatesInterface;

  occupiedOffset: AxesCoordinatesInterface;

  occupiedTranslate: AxesCoordinatesInterface;

  mousePoints: AxesCoordinatesInterface;

  isMovingDown: boolean;

  isMovingLeft: boolean;

  numberOfElementsTransformed: number;

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
    this.indexPlaceholder = order.self;

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

    const {
      offset: { width, height },
      currentPosition,
      translate,
    } = this.draggedElm;

    this.threshold = new Threshold(
      opts.threshold,
      {
        width,
        height,
        left: currentPosition.x,
        top: currentPosition.y,
      },
      { isContainer: false }
    );

    if (siblings !== null) {
      /**
       * Thresholds store, contains max value for each parent and for dragged. Depending on
       * ids as keys.
       */
      this.layoutThresholds = {
        [SK]: this.threshold.getThreshold(
          {
            top: siblingsBoundaries.top,
            left: siblingsBoundaries.maxLeft,
            height: siblingsBoundaries.bottom,
            width: 0,
          },
          true
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

    this.innerOffset = new AxesCoordinates(
      Math.round(x - this.draggedElm.currentPosition.x),
      Math.round(y - this.draggedElm.currentPosition.y)
    );

    const style = window.getComputedStyle(this.draggedElm.ref!);

    // get element margin
    const rm = Math.round(parseFloat(style.marginRight));
    const lm = Math.round(parseFloat(style.marginLeft));
    this.marginX = rm + lm;

    this.offsetPlaceholder = new AxesCoordinates(
      currentPosition.x,
      currentPosition.y
    );

    this.occupiedOffset = new AxesCoordinates(
      currentPosition.x,
      currentPosition.y
    );

    this.occupiedTranslate = new AxesCoordinates(translate.x, translate.y);

    /**
     * previous X and Y are used to calculate mouse directions.
     */
    this.mousePoints = new AxesCoordinates(x, y);

    /**
     * It counts number of element that dragged has passed. This counter is
     * crucial to calculate drag's translate and index
     */
    this.numberOfElementsTransformed = 0;

    this.isMovingDown = false;
    this.isMovingLeft = false;

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
    const currentTop = y - this.innerOffset.y;
    const currentBottom = currentTop + this.draggedElm.offset.height;

    if (!allowTop && currentTop <= topThreshold) {
      return isRestrictedToThreshold
        ? topThreshold + this.innerOffset.y
        : this.initY;
    }

    if (!allowBottom && currentBottom >= bottomThreshold) {
      return isRestrictedToThreshold
        ? bottomThreshold + this.innerOffset.y - this.draggedElm.offset.height
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
    const currentLeft = x - this.innerOffset.x;
    const currentRight = currentLeft + this.draggedElm.offset.width;

    if (!allowLeft && currentLeft <= leftThreshold) {
      return restrictToThreshold
        ? leftThreshold + this.innerOffset.x
        : this.initX;
    }

    if (!allowRight && currentRight + this.marginX >= rightThreshold) {
      return restrictToThreshold
        ? rightThreshold +
            this.innerOffset.x -
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

    return siblings !== null && this.indexPlaceholder <= 0;
  }

  private isLastELm() {
    return this.indexPlaceholder === this.getLastElmIndex();
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
    this.offsetPlaceholder.setAxes(
      filteredX - this.innerOffset.x,
      filteredY - this.innerOffset.y
    );
  }

  private isOutThresholdH($: ThresholdCoordinate) {
    const { x } = this.offsetPlaceholder;

    const { left } = $;

    return x < left.max || x > left.min;
  }

  private isOutPositionV() {
    const { top } = this.threshold.main;

    const { y } = this.offsetPlaceholder;

    return this.isMovingDown ? y > top.min : y < top.max;
  }

  private isOutPositionH() {
    const { left } = this.threshold.main;

    const { x } = this.offsetPlaceholder;

    return this.isMovingLeft ? x > left.min : x < left.max;
  }

  private isOutContainerV($: ThresholdCoordinate) {
    const { y } = this.offsetPlaceholder;

    const { top } = $;

    /**
     * Are you last element and outside the container? Or are you coming from top
     * and outside the container?
     */
    return (
      (this.isLastELm() && y > top.min) ||
      (this.indexPlaceholder < 0 && y < top.max)
    );
  }

  private isOutPosition($: ThresholdCoordinate) {
    this.isOutPositionHorizontally = false;

    if (this.isOutThresholdH($)) {
      this.isOutPositionHorizontally = true;

      return true;
    }

    if (this.isOutPositionV() || this.isOutPositionH()) {
      return true;
    }

    return false;
  }

  private isOutContainer($: ThresholdCoordinate) {
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
      : this.isOutPosition(this.threshold.main);
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

  setDraggedMovementDirection(coordinate: number, axes: Axes) {
    if (this.mousePoints[axes] === coordinate) return;

    this[axes === "y" ? `isMovingDown` : `isMovingLeft`] =
      coordinate > this.mousePoints[axes];

    this.mousePoints[axes] = coordinate;
  }

  incNumOfElementsTransformed(effectedElemDirection: number) {
    this.numberOfElementsTransformed += -1 * effectedElemDirection;
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
      if (!this.draggedElm.translate.isEqual(this.translatePlaceholder)) {
        this.draggedElm.transformElm();
        this.draggedElm.setDataset("index", this.draggedElm.order.self);

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

    this.draggedElm.currentPosition.clone(this.occupiedOffset);
    this.draggedElm.translate.clone(this.occupiedTranslate);

    this.draggedElm.transformElm();

    if (siblings) {
      this.draggedElm.assignNewPosition(siblings, this.indexPlaceholder);
    }

    this.draggedElm.order.self = this.indexPlaceholder;
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
