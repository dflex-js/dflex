import { DFlexBaseDraggable } from "@dflex/draggable";

import {
  Threshold,
  PointNum,
  PointBool,
  Migration,
  combineKeys,
  getParentElm,
} from "@dflex/utils";
import type {
  ThresholdInterface,
  IPointNum,
  IPointBool,
  IMigration,
  IPointAxes,
} from "@dflex/utils";

import { DFlexContainer, IDFlexNode } from "@dflex/core-instance";

import { initDFlexEvent, store } from "../DnDStore";

import type { IDraggableAxes } from "./types";

import type {
  ContainersTransition,
  FinalDndOpts,
  Restrictions,
  RestrictionsStatus,
} from "../types";
import { initMutationObserver } from "../DnDStore/DFlexMutations";

class DraggableAxes
  extends DFlexBaseDraggable<IDFlexNode>
  implements IDraggableAxes
{
  positionPlaceholder: IPointNum;

  gridPlaceholder: IPointNum;

  migration: IMigration;

  threshold: ThresholdInterface;

  isViewportRestricted: boolean;

  isMovingAwayFrom: IPointBool;

  readonly innerOffset: IPointNum;

  private isLayoutStateUpdated: boolean;

  private readonly axesFilterNeeded: boolean;

  readonly containersTransition: ContainersTransition;

  private readonly restrictions: Restrictions;

  private readonly restrictionsStatus: RestrictionsStatus;

  private readonly marginX: number;

  private readonly initCoordinates: IPointNum;

  events: ReturnType<typeof initDFlexEvent>;

  constructor(id: string, initCoordinates: IPointAxes, opts: FinalDndOpts) {
    const { element } = store.getElmTreeById(id);

    super(element, initCoordinates);

    this.isLayoutStateUpdated = false;

    const {
      order,
      grid,
      currentPosition,
      keys: { SK },
      offset: { width, height },
      depth,
    } = element;

    this.gridPlaceholder = new PointNum(grid.x, grid.y);

    const siblings = store.getElmBranchByKey(SK);

    this.migration = new Migration(order.self, SK, store.tracker.newTravel());

    const container = store.containers.get(SK)!;

    if (!container.lastElmPosition) {
      const lastElm = store.registry.get(siblings[siblings.length - 1])!;

      container.preservePosition(lastElm.currentPosition);
    }

    this.isViewportRestricted = true;

    this.containersTransition = opts.containersTransition;

    this.threshold = new Threshold(opts.threshold);

    this.threshold.setMainThreshold(id, {
      width,
      height,
      left: currentPosition.x,
      top: currentPosition.y,
    });

    this.appendDraggedToContainerDimensions(true);

    store.getBranchesByDepth(depth).forEach((key) => {
      const elmContainer = store.containers.get(key)!;

      const { boundaries } = elmContainer;

      if (__DEV__) {
        if (!boundaries) {
          throw new Error(`Siblings boundaries for ${key} not found.`);
        }
      }

      this.threshold.setContainerThreshold(
        key,
        depth,
        boundaries,
        store.unifiedContainerDimensions.get(depth)!
      );

      if (elmContainer.originLength === DFlexContainer.OUT_OF_RANGE) {
        const { length } = store.getElmBranchByKey(key);
        elmContainer.originLength = length;
      }

      if (!store.interactiveDOM.has(key)) {
        setTimeout(() => {
          const childDOM = store.registry.get(store.getElmBranchByKey(key)[0])!
            .ref!;

          getParentElm(childDOM, (parentDOM) => {
            store.interactiveDOM.set(key, parentDOM);
            initMutationObserver(store, parentDOM);
            return true;
          });
        }, 0);
      }
    });

    this.isMovingAwayFrom = new PointBool(false, false);

    const { x, y } = initCoordinates;

    this.initCoordinates = new PointNum(x, y);

    this.innerOffset = new PointNum(
      Math.round(x - currentPosition.x),
      Math.round(y - currentPosition.y)
    );

    const style = window.getComputedStyle(this.draggedElm.ref!);

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

    this.events = initDFlexEvent(this.draggedElm.ref!);

    this.axesFilterNeeded =
      siblings !== null &&
      (opts.restrictionsStatus.isContainerRestricted ||
        opts.restrictionsStatus.isSelfRestricted);
  }

  protected appendDraggedToContainerDimensions(isAppend: boolean) {
    const {
      depth,
      offset: { height },
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
    const currentBottom = currentTop + this.draggedElm.offset.height;

    if (!allowTop && currentTop <= topThreshold) {
      return isRestrictedToThreshold
        ? topThreshold + this.innerOffset.y
        : this.initCoordinates.y;
    }

    if (!allowBottom && currentBottom >= bottomThreshold) {
      return isRestrictedToThreshold
        ? bottomThreshold + this.innerOffset.y - this.draggedElm.offset.height
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
    const currentRight = currentLeft + this.draggedElm.offset.width;

    if (!allowLeft && currentLeft <= leftThreshold) {
      return restrictToThreshold
        ? leftThreshold + this.innerOffset.x
        : this.initCoordinates.x;
    }

    if (!allowRight && currentRight + this.marginX >= rightThreshold) {
      return restrictToThreshold
        ? rightThreshold +
            this.innerOffset.x -
            this.draggedElm.offset.width -
            this.marginX
        : this.initCoordinates.x;
    }

    return x;
  }

  dragAt(x: number, y: number) {
    if (!this.isLayoutStateUpdated) {
      this.isLayoutStateUpdated = true;
      store.listeners.notify({ layoutState: "dragging", type: "layoutState" });
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
        container.scroll.getMaximumScrollContainerLeft(),
        false,
        false,
        true
      );
      filteredY = this.axesYFilter(
        y,
        0,
        container.scroll.getMaximumScrollContainerTop(),
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
      offset: { height, width },
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
