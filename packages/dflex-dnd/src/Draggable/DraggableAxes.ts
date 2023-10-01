import { DFlexBaseDraggable } from "@dflex/draggable";

import {
  Threshold,
  PointNum,
  DFlexCycle,
  combineKeys,
  AxesPoint,
  BoxNum,
  AbstractBoxRect,
  Axis,
  assertElmPos,
  featureFlags,
  PREFIX_TRACKER_CYCLE,
  tracker,
} from "@dflex/utils";

import type { DFlexElement } from "@dflex/core-instance";

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

function initContainers(SK: string, siblings: string[]) {
  const container = store.containers.get(SK)!;

  if (!container.lastElmPosition) {
    const lastElm = store.registry.get(siblings[siblings.length - 1])!;

    container.preservePosition(lastElm.rect.getPosition());
  }
}

function initThresholds(
  draggedID: string,
  draggedRect: AbstractBoxRect,
  draggedDepth: number,
  threshold: Threshold,
) {
  threshold.setMainThreshold(draggedID, draggedRect, false);

  store.getSiblingKeysByDepth(draggedDepth).forEach((SK) => {
    const elmContainer = store.containers.get(SK)!;

    const boundaries = elmContainer.getBoundaries();

    threshold.setContainerThreshold(
      SK,
      draggedDepth,
      boundaries,
      store.unifiedContainerDimensions[draggedDepth],
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
  private _absoluteInnerOffset: PointNum;

  private _viewportInnerOffset: PointNum;

  /**
   * Dragged edge current position including the inner offset.
   *
   * Note: Scroll position included, these points ignore viewport.
   */
  private _absoluteCurrentPos: BoxNum;

  private _viewportCurrentPos: BoxNum;

  private _prevPoint: PointNum;

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

    const siblings = store.getElmSiblingsByKey(SK);

    const cycleID = tracker.newTravel(PREFIX_TRACKER_CYCLE);

    this.session = [cycleID];

    if (store.migration === null) {
      store.migration = new DFlexCycle(
        VDOMOrder.self,
        this.draggedElm.id,
        SK,
        cycleID,
        // TODO: refactor this to use if the dragged belongs to scroll container or not.
        false,
      );
    } else {
      store.migration.add(
        VDOMOrder.self,
        this.draggedElm.id,
        SK,
        false,
        cycleID,
        // TODO: refactor this to use if the dragged belongs to scroll container or not.
        false,
      );
    }

    this.isViewportRestricted = true;

    // Override containersTransition option when we have an orphan branch.
    this.containersTransition =
      store.getSiblingKeysByDepth(depth).length > 1
        ? opts.containersTransition
        : { ...opts.containersTransition, enable: false };

    initContainers(SK, siblings);

    this.appendDraggedToContainerDimensions(true);

    this.threshold = new Threshold(opts.threshold);

    initThresholds(id, rect, depth, this.threshold);

    const style = getComputedStyle(DOM);

    // get element margin
    const rm = Math.round(parseFloat(style.marginRight));
    const lm = Math.round(parseFloat(style.marginLeft));
    this.marginX = rm + lm;

    const {
      totalScrollRect: { left, top },
    } = store.scrolls.get(SK)!;

    const { x, y } = initCoordinates;

    this.initCoordinates = new PointNum(x, y);

    this._absoluteInnerOffset = new PointNum(
      Math.round(x - rect.left),
      Math.round(y - rect.top),
    );

    this._viewportInnerOffset = new PointNum(
      Math.round(x - (rect.left - left)),
      Math.round(y - (rect.top - top)),
    );

    this._absoluteCurrentPos = new BoxNum(
      rect.top,
      rect.right,
      rect.bottom,
      rect.left,
    );

    const viewportTop = rect.top - top;
    const viewportLeft = rect.left - left;

    this._viewportCurrentPos = new BoxNum(
      viewportTop,
      viewportLeft + rect.width,
      viewportTop + rect.height,
      viewportLeft,
    );

    if (__DEV__) {
      if (featureFlags.enablePositionAssertion) {
        assertElmPos(DOM, this._viewportCurrentPos);
      }
    }

    this._prevPoint = new PointNum(x, y);

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
    isRestrictedToThreshold: boolean, // if not. Then to self.
  ) {
    const currentTop = y - this._absoluteInnerOffset.y;
    const currentBottom = currentTop + this.draggedElm.rect.height;

    if (!allowTop && currentTop <= topThreshold) {
      return isRestrictedToThreshold
        ? topThreshold + this._absoluteInnerOffset.y
        : this.initCoordinates.y;
    }

    if (!allowBottom && currentBottom >= bottomThreshold) {
      return isRestrictedToThreshold
        ? bottomThreshold +
            this._absoluteInnerOffset.y -
            this.draggedElm.rect.height
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
    restrictToThreshold: boolean, // if not. Then to self.,
  ) {
    const currentLeft = x - this._absoluteInnerOffset.x;
    const currentRight = currentLeft + this.draggedElm.rect.width;

    if (!allowLeft && currentLeft <= leftThreshold) {
      return restrictToThreshold
        ? leftThreshold + this._absoluteInnerOffset.x
        : this.initCoordinates.x;
    }

    if (!allowRight && currentRight + this.marginX >= rightThreshold) {
      return restrictToThreshold
        ? rightThreshold +
            this._absoluteInnerOffset.x -
            this.draggedElm.rect.width -
            this.marginX
        : this.initCoordinates.x;
    }

    return x;
  }

  private _updatePrevPos() {
    const pre = this._viewportCurrentPos;
    this._prevPoint.setAxes(pre.left, pre.top);
  }

  private _getAbsEdgePos(x: number, y: number) {
    const edgePosLeft = x - this._absoluteInnerOffset.x;
    const edgePosTop = y - this._absoluteInnerOffset.y;

    return [edgePosLeft, edgePosTop];
  }

  private _getViewportEdgePos(x: number, y: number) {
    const edgePosLeft = x - this._viewportInnerOffset.x;
    const edgePosTop = y - this._viewportInnerOffset.y;

    return [edgePosLeft, edgePosTop];
  }

  setCurrentPos(
    x: number,
    y: number,
    scrollOffsetX: number,
    scrollOffsetY: number,
  ): void {
    this._updatePrevPos();

    const [absEdgePosLeft, absEdgePosTop] = this._getAbsEdgePos(x, y);
    const [edgePosLeft, edgePosTop] = this._getViewportEdgePos(x, y);

    const {
      rect: { width, height },
    } = this.draggedElm;

    const absTop = absEdgePosTop + scrollOffsetY;
    const absLeft = absEdgePosLeft + scrollOffsetX;

    this._absoluteCurrentPos.setBox(
      absTop,
      absLeft + width,
      absTop + height,
      absLeft,
    );

    this._viewportCurrentPos.setBox(
      edgePosTop,
      edgePosLeft + width,
      edgePosTop + height,
      edgePosLeft,
    );
  }

  getAbsoluteCurrentPos(): BoxNum {
    return this._absoluteCurrentPos;
  }

  getViewportCurrentPos(): BoxNum {
    return this._viewportCurrentPos;
  }

  getDirectionByAxis(axis: Axis): "r" | "l" | "d" | "u" {
    const { x: previousX, y: previousY } = this._prevPoint;
    const { left: currentX, top: currentY } = this.getAbsoluteCurrentPos();

    if (axis === "x") {
      if (currentX > previousX) {
        // Box moved right
        return "r";
      }

      // Box moved left
      return "l";
    }

    if (currentY > previousY) {
      // Box moved down
      return "d";
    }

    // Box moved up
    return "u";
  }

  dragWithOffset(
    x: number,
    y: number,
    scrollOffsetX: number,
    scrollOffsetY: number,
  ) {
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
          false,
        );
        filteredY = this.axesYFilter(
          y,
          top,
          bottom,
          this.restrictions.container.allowLeavingFromTop,
          this.restrictions.container.allowLeavingFromBottom,
          true,
        );
      } else if (this.restrictionsStatus.isSelfRestricted) {
        filteredX = this.axesXFilter(
          x,
          maxLeft,
          minRight,
          this.restrictions.self.allowLeavingFromLeft,
          this.restrictions.self.allowLeavingFromRight,
          false,
        );
        filteredY = this.axesYFilter(
          y,
          this.draggedElm.rect.top,
          this.draggedElm.rect.top + this.draggedElm.rect.height,
          this.restrictions.self.allowLeavingFromTop,
          this.restrictions.self.allowLeavingFromBottom,
          false,
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
        true,
      );
      filteredY = this.axesYFilter(
        y,
        0,
        scroll.getMaximumScrollContainerTop(),
        false,
        false,
        true,
      );
    }

    this.translate(filteredX, filteredY);

    this.setCurrentPos(filteredX, filteredY, scrollOffsetX, scrollOffsetY);
  }

  isOutThreshold(SK?: string, useInsertionThreshold?: boolean) {
    const { id, depth } = this.draggedElm;

    let key = SK || id;

    if (useInsertionThreshold) {
      key = combineKeys(depth, key);
    }

    return this.threshold.isOutThreshold(key, this._absoluteCurrentPos, null);
  }

  isNotSettled() {
    const { SK, index } = store.migration.latest();

    const lastElm = store.getElmSiblingsByKey(SK).length - 1;

    const isLeavingFromBottom = index === lastElm;

    return (
      !isLeavingFromBottom && (this.isOutThreshold() || this.isOutThreshold(SK))
    );
  }
}

export default DraggableAxes;
