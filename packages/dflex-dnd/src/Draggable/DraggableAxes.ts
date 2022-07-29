import { DFlexBaseDraggable } from "@dflex/draggable";

import {
  Threshold,
  PointNum,
  PointBool,
  Migration,
  combineKeys,
  AxesPoint,
  RectDimensions,
  FourDirections,
} from "@dflex/utils";

import type { DFlexNode } from "@dflex/core-instance";

import type { ELmBranch } from "@dflex/dom-gen";
import { initDFlexEvent, scheduler, store } from "../LayoutManager";

import type {
  ContainersTransition,
  FinalDndOpts,
  Restrictions,
  RestrictionsStatus,
} from "../types";

function initContainers(SK: string, siblings: ELmBranch) {
  const container = store.containers.get(SK)!;

  if (!container.lastElmPosition) {
    const lastElm = store.registry.get(siblings[siblings.length - 1])!;

    container.preservePosition(lastElm.currentPosition);
  }
}

function initThresholds(
  draggedID: string,
  draggedRect: RectDimensions,
  draggedDepth: number,
  threshold: Threshold
) {
  threshold.setMainThreshold(draggedID, draggedRect, false);

  store.getBranchesByDepth(draggedDepth).forEach((key) => {
    const elmContainer = store.containers.get(key)!;

    const { boundaries } = elmContainer;

    if (__DEV__) {
      if (!boundaries) {
        throw new Error(`Siblings boundaries for ${key} not found.`);
      }
    }

    const insertionLayerKey = combineKeys(draggedDepth, key);

    threshold.setContainerThreshold(
      key,
      insertionLayerKey,
      draggedDepth,
      boundaries,
      store.unifiedContainerDimensions.get(draggedDepth)!
    );
  });
}

class DraggableAxes extends DFlexBaseDraggable<DFlexNode> {
  gridPlaceholder: PointNum;

  migration: Migration;

  threshold!: Threshold;

  isViewportRestricted: boolean;

  /** *@deprecated */
  isMovingAwayFrom: PointBool;

  /**
   * The inner distance between the mouse coordinates and the element position.
   *
   * innerOffset.x: represents the distance from mouse.x to element.x
   * innerOffset.x: represents the distance from mouse.y to element.y
   */
  readonly innerOffset: PointNum;

  /**
   * Dragged edge current position including the inner offset.
   *
   * Note: Scroll position included, these points ignore viewport.
   */
  currentPositionWithScroll: FourDirections<number>;

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

    initContainers(SK, siblings);

    this.threshold = new Threshold(opts.threshold);

    initThresholds(
      id,
      {
        width,
        height,
        left: currentPosition.x,
        top: currentPosition.y,
      },
      depth,
      this.threshold
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

    this.currentPositionWithScroll = new FourDirections(
      currentPosition.y,
      currentPosition.x + width,
      currentPosition.y + height,
      currentPosition.x
    );

    this.restrictions = opts.restrictions;

    this.restrictionsStatus = opts.restrictionsStatus;

    this.events = initDFlexEvent(DOM);

    this.axesFilterNeeded =
      siblings !== null &&
      (opts.restrictionsStatus.isContainerRestricted ||
        opts.restrictionsStatus.isSelfRestricted);
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

    const edgeCurrentPositionLeft = filteredX - this.innerOffset.x;
    const edgeCurrentPositionTop = filteredY - this.innerOffset.y;

    const {
      initialOffset: { width, height },
    } = this.draggedElm;

    /**
     * Every time we got new translate, offset should be updated
     */
    this.currentPositionWithScroll.setAll(
      edgeCurrentPositionTop,
      edgeCurrentPositionLeft + width,
      edgeCurrentPositionTop + height,
      edgeCurrentPositionLeft
    );
  }

  isOutThreshold(SK?: string, useInsertionThreshold?: boolean) {
    const { id, depth } = this.draggedElm;

    const { top, right, bottom, left } = this.currentPositionWithScroll;

    let key = SK || id;

    if (useInsertionThreshold) {
      key = combineKeys(depth, key);
    }

    return this.threshold.isOutThreshold(key, top, right, bottom, left);
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
