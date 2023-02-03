import { DFlexBaseDraggable } from "@dflex/draggable";

import {
  Threshold,
  PointNum,
  DFlexCycle,
  combineKeys,
  AxesPoint,
  BoxNum,
  BoxRectAbstract,
  Tracker,
} from "@dflex/utils";

import type { DFlexElement } from "@dflex/core-instance";

import type { Siblings } from "@dflex/dom-gen";
import {
  DFlexEventPlugin,
  initDFlexEvent,
  scheduler,
  store,
} from "../LayoutManager";

import type {
  ContainersTransition,
  FinalDndOpts,
  Restrictions,
  RestrictionsStatus,
} from "../types";

function initContainers(SK: string, siblings: Siblings) {
  const container = store.containers.get(SK)!;

  if (!container.lastElmPosition) {
    const lastElm = store.registry.get(siblings[siblings.length - 1])!;

    container.preservePosition(lastElm.rect.getPosition());
  }
}

function initThresholds(
  draggedID: string,
  draggedRect: BoxRectAbstract,
  draggedDepth: number,
  threshold: Threshold
) {
  threshold.setMainThreshold(draggedID, draggedRect, false);

  store.getBranchesByDepth(draggedDepth).forEach((SK) => {
    const elmContainer = store.containers.get(SK)!;

    const boundaries = elmContainer.getBoundaries();

    const insertionLayerKey = combineKeys(draggedDepth, SK);

    threshold.setContainerThreshold(
      SK,
      insertionLayerKey,
      draggedDepth,
      boundaries,
      store.unifiedContainerDimensions[draggedDepth]
    );
  });
}

class DraggableAxes extends DFlexBaseDraggable<DFlexElement> {
  gridPlaceholder: PointNum;

  threshold!: Threshold;

  isViewportRestricted: boolean;

  /**
   * Contains the collection of cycles-id that's done during the session.
   * Session: Starts when dragging is triggered and end with it.
   */
  session: string[];

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
  private _absoluteCurrentPosition: BoxNum;

  private isLayoutStateUpdated: boolean;

  private readonly axesFilterNeeded: boolean;

  readonly containersTransition: ContainersTransition;

  private readonly restrictions: Restrictions;

  private readonly restrictionsStatus: RestrictionsStatus;

  private readonly marginX: number;

  private readonly initCoordinates: PointNum;

  events: DFlexEventPlugin;

  constructor(id: string, initCoordinates: AxesPoint, opts: FinalDndOpts) {
    const [element, DOM] = store.getElmWithDOM(id);

    super(element, DOM, initCoordinates);

    this.isLayoutStateUpdated = false;

    const {
      VDOMOrder,
      DOMGrid,
      keys: { SK },
      depth,
      rect,
    } = element;

    this.gridPlaceholder = new PointNum(DOMGrid.x, DOMGrid.y);

    const siblings = store.getElmBranchByKey(SK);

    const cycleID = store.tracker.newTravel(Tracker.PREFIX_CYCLE);

    this.session = [cycleID];

    if (store.migration === null) {
      store.migration = new DFlexCycle(
        VDOMOrder.self,
        this.draggedElm.id,
        SK,
        cycleID,
        // TODO: refactor this to use if the dragged belongs to scroll container or not.
        false
      );
    } else {
      store.migration.add(
        VDOMOrder.self,
        this.draggedElm.id,
        SK,
        cycleID,
        // TODO: refactor this to use if the dragged belongs to scroll container or not.
        false
      );
    }

    this.isViewportRestricted = true;

    // Override containersTransition option when we have an orphan branch.
    this.containersTransition =
      store.getBranchesByDepth(depth).length > 1
        ? opts.containersTransition
        : { ...opts.containersTransition, enable: false };

    initContainers(SK, siblings);

    this.appendDraggedToContainerDimensions(true);

    this.threshold = new Threshold(opts.threshold);

    initThresholds(id, rect, depth, this.threshold);

    const { x, y } = initCoordinates;

    this.initCoordinates = new PointNum(x, y);

    this.innerOffset = new PointNum(
      Math.round(x - rect.left),
      Math.round(y - rect.top)
    );

    const style = getComputedStyle(DOM);

    // get element margin
    const rm = Math.round(parseFloat(style.marginRight));
    const lm = Math.round(parseFloat(style.marginLeft));
    this.marginX = rm + lm;

    this._absoluteCurrentPosition = new BoxNum(
      rect.top,
      rect.right,
      rect.bottom,
      rect.left
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
    const { depth, rect } = this.draggedElm;

    const maneuverDistance = rect.height;

    store.unifiedContainerDimensions[depth].height += isAppend
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
    const currentBottom = currentTop + this.draggedElm.rect.height;

    if (!allowTop && currentTop <= topThreshold) {
      return isRestrictedToThreshold
        ? topThreshold + this.innerOffset.y
        : this.initCoordinates.y;
    }

    if (!allowBottom && currentBottom >= bottomThreshold) {
      return isRestrictedToThreshold
        ? bottomThreshold + this.innerOffset.y - this.draggedElm.rect.height
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
    const currentRight = currentLeft + this.draggedElm.rect.width;

    if (!allowLeft && currentLeft <= leftThreshold) {
      return restrictToThreshold
        ? leftThreshold + this.innerOffset.x
        : this.initCoordinates.x;
    }

    if (!allowRight && currentRight + this.marginX >= rightThreshold) {
      return restrictToThreshold
        ? rightThreshold +
            this.innerOffset.x -
            this.draggedElm.rect.width -
            this.marginX
        : this.initCoordinates.x;
    }

    return x;
  }

  /**
   *
   * @param x
   * @param y
   */
  setAbsoluteCurrentPosition(x: number, y: number): void {
    const edgePosLeft = x - this.innerOffset.x;
    const edgePosTop = y - this.innerOffset.y;

    const {
      rect: { width, height },
    } = this.draggedElm;

    this._absoluteCurrentPosition.setBox(
      edgePosTop,
      edgePosLeft + width,
      edgePosTop + height,
      edgePosLeft
    );
  }

  /**
   *
   * @returns
   */
  getAbsoluteCurrentPosition(): BoxNum {
    return this._absoluteCurrentPosition;
  }

  /**
   *
   * @param x
   * @param y
   * @param scrollOffsetX
   * @param scrollOffsetY
   */
  dragAt(x: number, y: number, scrollOffsetX: number, scrollOffsetY: number) {
    if (!this.isLayoutStateUpdated) {
      this.isLayoutStateUpdated = true;
      scheduler(store, null, null, {
        type: "layoutState",
        status: "dragging",
      });
    }

    let filteredY = y;
    let filteredX = x;

    const { SK } = store.registry.get(this.draggedElm.id)!.keys;
    const container = store.containers.get(SK)!;

    if (this.axesFilterNeeded) {
      const boundaries = container.getBoundaries();
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
          this.draggedElm.rect.top,
          this.draggedElm.rect.top + this.draggedElm.rect.height,
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

    this.setAbsoluteCurrentPosition(
      filteredX + scrollOffsetX,
      filteredY + scrollOffsetY
    );
  }

  isOutThreshold(SK?: string, useInsertionThreshold?: boolean) {
    const { id, depth } = this.draggedElm;

    const { top, right, bottom, left } = this._absoluteCurrentPosition;

    let key = SK || id;

    if (useInsertionThreshold) {
      key = combineKeys(depth, key);
    }

    return this.threshold.isOutThreshold(key, top, right, bottom, left);
  }

  isNotSettled() {
    const { SK, index } = store.migration.latest();

    const lastElm = store.getElmBranchByKey(SK).length - 1;

    const isLeavingFromBottom = index === lastElm;

    return (
      !isLeavingFromBottom && (this.isOutThreshold() || this.isOutThreshold(SK))
    );
  }
}

export default DraggableAxes;
