import { DFlexBaseDraggable } from "@dflex/draggable";

import {
  Threshold,
  PointNum,
  PointBool,
  Migration,
  combineKeys,
  AxesPoint,
  RectDimensions,
  ThresholdPercentages,
} from "@dflex/utils";

import type { DFlexNode } from "@dflex/core-instance";

import { initDFlexEvent, scheduler, store } from "../LayoutManager";

import type {
  ContainersTransition,
  FinalDndOpts,
  Restrictions,
  RestrictionsStatus,
} from "../types";

class DraggableAxes extends DFlexBaseDraggable<DFlexNode> {
  positionPlaceholder: PointNum;

  gridPlaceholder: PointNum;

  migration: Migration;

  threshold!: Threshold;

  isViewportRestricted: boolean;

  isMovingAwayFrom: PointBool;

  readonly innerOffset: PointNum;

  private isLayoutStateUpdated: boolean;

  private readonly axesFilterNeeded: boolean;

  readonly containersTransition: ContainersTransition;

  private readonly restrictions: Restrictions;

  private readonly restrictionsStatus: RestrictionsStatus;

  private readonly marginX: number;

  private readonly initCoordinates: PointNum;

  events: ReturnType<typeof initDFlexEvent>;

  constructor(id: string, initCoordinates: AxesPoint, opts: FinalDndOpts) {
    const [element, DOM] = store.getElmWithDOM(id);

    super(element, DOM, initCoordinates);

    this.isLayoutStateUpdated = false;

    const {
      order,
      grid,
      currentPosition,
      keys: { SK },
      depth,
      initialOffset: { width, height },
    } = element;

    this.gridPlaceholder = new PointNum(grid.x, grid.y);

    const siblings = store.getElmBranchByKey(SK);

    this.migration = new Migration(order.self, SK, store.tracker.newTravel());

    this.isViewportRestricted = true;

    this.containersTransition = opts.containersTransition;

    this._initThresholds(
      id,
      {
        width,
        height,
        left: currentPosition.x,
        top: currentPosition.y,
      },
      depth,
      opts.threshold
    );

    this.appendDraggedToContainerDimensions(true);

    this.isMovingAwayFrom = new PointBool(false, false);

    const { x, y } = initCoordinates;

    this.initCoordinates = new PointNum(x, y);

    this.innerOffset = new PointNum(
      Math.round(x - currentPosition.x),
      Math.round(y - currentPosition.y)
    );

    const style = getComputedStyle(DOM);

    // get element margin
    const rm = Math.round(parseFloat(style.marginRight));
    const lm = Math.round(parseFloat(style.marginLeft));
    this.marginX = rm + lm;

    this.positionPlaceholder = new PointNum(
      currentPosition.x,
      currentPosition.y
    );

    this.restrictions = opts.restrictions;

    this.restrictionsStatus = opts.restrictionsStatus;

    this.events = initDFlexEvent(DOM);

    this.axesFilterNeeded =
      siblings !== null &&
      (opts.restrictionsStatus.isContainerRestricted ||
        opts.restrictionsStatus.isSelfRestricted);
  }

  private _initThresholds(
    id: string,
    rect: RectDimensions,
    depth: number,
    thresholdPercentage: ThresholdPercentages
  ) {
    this.threshold = new Threshold(thresholdPercentage);

    this.threshold.setMainThreshold(id, rect, false);

    store.getBranchesByDepth(depth).forEach((key) => {
      const elmContainer = store.containers.get(key)!;

      const { boundaries } = elmContainer;

      if (__DEV__) {
        if (!boundaries) {
          throw new Error(`Siblings boundaries for ${key} not found.`);
        }
      }

      const insertionLayerKey = combineKeys(depth, key);

      this.threshold.setContainerThreshold(
        key,
        insertionLayerKey,
        depth,
        boundaries,
        store.unifiedContainerDimensions.get(depth)!
      );
    });
  }

  protected appendDraggedToContainerDimensions(isAppend: boolean) {
    const {
      depth,
      initialOffset: { height },
    } = this.draggedElm;

    const maneuverDistance = height;

    store.unifiedContainerDimensions.get(depth)!.height += isAppend
      ? maneuverDistance
      : -1 * maneuverDistance;
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
    const currentBottom = currentTop + this.draggedElm.initialOffset.height;

    if (!allowTop && currentTop <= topThreshold) {
      return isRestrictedToThreshold
        ? topThreshold + this.innerOffset.y
        : this.initCoordinates.y;
    }

    if (!allowBottom && currentBottom >= bottomThreshold) {
      return isRestrictedToThreshold
        ? bottomThreshold +
            this.innerOffset.y -
            this.draggedElm.initialOffset.height
        : this.initCoordinates.y;
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
    const currentRight = currentLeft + this.draggedElm.initialOffset.width;

    if (!allowLeft && currentLeft <= leftThreshold) {
      return restrictToThreshold
        ? leftThreshold + this.innerOffset.x
        : this.initCoordinates.x;
    }

    if (!allowRight && currentRight + this.marginX >= rightThreshold) {
      return restrictToThreshold
        ? rightThreshold +
            this.innerOffset.x -
            this.draggedElm.initialOffset.width -
            this.marginX
        : this.initCoordinates.x;
    }

    return x;
  }

  dragAt(x: number, y: number) {
    if (!this.isLayoutStateUpdated) {
      this.isLayoutStateUpdated = true;
      scheduler(store, null, null, {
        layoutState: "dragging",
        type: "layoutState",
      });
    }

    let filteredY = y;
    let filteredX = x;

    const { SK } = store.registry.get(this.draggedElm.id)!.keys;
    const container = store.containers.get(SK)!;

    if (this.axesFilterNeeded) {
      const { boundaries } = container;
      const { top, bottom, left: maxLeft, right: minRight } = boundaries;

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
          this.draggedElm.currentPosition.y +
            this.draggedElm.initialOffset.height,
          this.restrictions.self.allowLeavingFromTop,
          this.restrictions.self.allowLeavingFromBottom,
          false
        );
      }
    } else if (this.isViewportRestricted) {
      const scroll = store.scrolls.get(SK)!;

      // TODO: Test the fix this when scroll is implemented.
      filteredX = this.axesXFilter(
        x,
        0,
        scroll.getMaximumScrollContainerLeft(),
        false,
        false,
        true
      );
      filteredY = this.axesYFilter(
        y,
        0,
        scroll.getMaximumScrollContainerTop(),
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

  isOutThreshold(SK?: string, useInsertionThreshold?: boolean) {
    const {
      id,
      depth,
      initialOffset: { height, width },
    } = this.draggedElm;

    const { x, y } = this.positionPlaceholder;

    let key = SK || id;

    if (useInsertionThreshold) {
      key = combineKeys(depth, key);
    }

    return (
      this.threshold.isOutThresholdV(key, y, y + height) ||
      this.threshold.isOutThresholdH(key, x, x + width)
    );
  }

  private isLeavingFromBottom() {
    const lastElm =
      store.getElmBranchByKey(this.migration.latest().SK).length - 1;

    return this.migration.latest().index === lastElm;
  }

  isNotSettled() {
    return (
      !this.isLeavingFromBottom() &&
      (this.isOutThreshold() || this.isOutThreshold(this.migration.latest().SK))
    );
  }
}

export default DraggableAxes;
