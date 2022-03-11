import { AbstractDraggable } from "@dflex/draggable";
import type { Coordinates } from "@dflex/draggable";

import { AxesCoordinates, AxesCoordinatesBool } from "@dflex/utils";
import type {
  AxesCoordinatesInterface,
  AxesCoordinatesBoolInterface,
} from "@dflex/utils";

import type { CoreInstanceInterface } from "@dflex/core-instance";

import store from "../DnDStore";

import type {
  DraggableAxesInterface,
  SiblingsThreshold,
  Restrictions,
} from "./types";

import type { FinalDndOpts, RestrictionsStatus } from "../types";

import Threshold from "../Plugins/Threshold";
import type {
  ThresholdInterface,
  ThresholdCoordinate,
} from "../Plugins/Threshold";

class DraggableAxes
  extends AbstractDraggable<CoreInstanceInterface>
  implements DraggableAxesInterface
{
  private isLayoutStateUpdated: boolean;

  indexPlaceholder: number;

  positionPlaceholder: AxesCoordinatesInterface;

  threshold: ThresholdInterface;

  layoutThresholds: SiblingsThreshold;

  isViewportRestricted: boolean;

  innerOffset: AxesCoordinatesInterface;

  mousePoints: AxesCoordinatesInterface;

  isMovingAwayFrom: AxesCoordinatesBoolInterface;

  isDraggedOutPosition: AxesCoordinatesBoolInterface;

  isDraggedOutContainer: AxesCoordinatesBoolInterface;

  private axesFilterNeeded: boolean;

  private restrictions: Restrictions;

  private restrictionsStatus: RestrictionsStatus;

  private marginX: number;

  private initY: number;

  private initX: number;

  constructor(id: string, initCoordinates: Coordinates, opts: FinalDndOpts) {
    const { element } = store.getElmTreeById(id);

    super(element, initCoordinates);

    this.isLayoutStateUpdated = false;

    const { order } = element;

    this.indexPlaceholder = order.self;

    const { SK } = store.registry[id].keys;

    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

    this.isViewportRestricted = true;

    const siblingsBoundaries = store.siblingsBoundaries[SK];

    const {
      offset: { width, height },
      currentPosition,
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
            left: siblingsBoundaries.left,
            height: siblingsBoundaries.height,
            width: 0,
          },
          true
        ),
      };
    } else {
      this.layoutThresholds = {};
    }

    this.isDraggedOutPosition = new AxesCoordinatesBool(false, false);
    this.isDraggedOutContainer = new AxesCoordinatesBool(false, false);
    this.isMovingAwayFrom = new AxesCoordinatesBool(false, false);

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

    this.positionPlaceholder = new AxesCoordinates(
      currentPosition.x,
      currentPosition.y
    );

    this.mousePoints = new AxesCoordinates(x, y);

    this.restrictions = opts.restrictions;

    this.restrictionsStatus = opts.restrictionsStatus;

    this.axesFilterNeeded =
      siblings !== null &&
      (opts.restrictionsStatus.isContainerRestricted ||
        opts.restrictionsStatus.isSelfRestricted);
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

  private setDraggedMouseMovement(x: number, y: number) {
    this.isMovingAwayFrom.setAxes(
      x > this.mousePoints.x,
      y > this.mousePoints.y
    );

    this.mousePoints.setAxes(x, y);
  }

  dragAt(x: number, y: number) {
    if (!this.isLayoutStateUpdated) {
      this.isLayoutStateUpdated = true;
      store.onStateChange("dragging");
    }

    this.setDraggedMouseMovement(x, y);

    let filteredY = y;
    let filteredX = x;

    const { SK } = store.registry[this.draggedElm.id].keys;

    if (this.axesFilterNeeded) {
      const {
        top,
        height: bottom,
        left: maxLeft,
        width: minRight,
      } = store.siblingsBoundaries[SK];

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
    this.positionPlaceholder.setAxes(
      filteredX - this.innerOffset.x,
      filteredY - this.innerOffset.y
    );
  }

  private isOutThresholdH($: ThresholdCoordinate) {
    const { x } = this.positionPlaceholder;

    const { left } = $;

    return x > left.min || x < left.max;
  }

  private isOutPositionV($: ThresholdCoordinate) {
    const { y } = this.positionPlaceholder;

    const { top } = $;

    return this.isMovingAwayFrom.y ? y > top.min : y < top.max;
  }

  private getLastElmIndex() {
    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

    return siblings!.length - 1;
  }

  private isLastELm() {
    return this.indexPlaceholder === this.getLastElmIndex();
  }

  private isOutContainerV($: ThresholdCoordinate) {
    const { y } = this.positionPlaceholder;

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

  private checkPosition(
    $: ThresholdCoordinate,
    flag: "isDraggedOutPosition" | "isDraggedOutContainer"
  ) {
    if (this.isOutThresholdH($)) {
      this[flag].setAxes(true, false);

      return true;
    }

    if (this.isOutPositionV($)) {
      this[flag].setAxes(false, true);

      return true;
    }

    this[flag].setFalsy();

    return false;
  }

  private isOutContainer($: ThresholdCoordinate) {
    if (this.isOutContainerV($)) {
      this.isDraggedOutContainer.setAxes(false, true);

      return true;
    }

    if (this.isOutThresholdH($)) {
      this.isDraggedOutContainer.setAxes(true, false);

      return true;
    }

    this.isDraggedOutContainer.setFalsy();

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
      : this.checkPosition(this.threshold.main, "isDraggedOutPosition");
  }

  isLeavingFromHead() {
    return (
      !this.isMovingAwayFrom.y && this.indexPlaceholder <= 0 // first our outside.
    );
  }

  isLeavingFromTail() {
    const { SK } = store.registry[this.draggedElm.id].keys;

    const lastElm =
      (store.getElmSiblingsListById(this.draggedElm.id) as string[]).length - 1;

    return (
      this.indexPlaceholder === lastElm &&
      this.isOutContainerV(this.layoutThresholds[SK])
    );
  }

  isNotSettled() {
    const { SK } = store.registry[this.draggedElm.id].keys;

    return (
      !this.isLeavingFromTail() &&
      (this.isOutThreshold() || this.isOutThreshold(SK))
    );
  }
}

export default DraggableAxes;
