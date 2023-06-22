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
  PREFIX_CYCLE,
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
    const lastElm = store._registry.get(siblings[siblings.length - 1])!;

    container._preservePosition(lastElm.rect._getPosition());
  }
}

function initThresholds(
  draggedID: string,
  draggedRect: AbstractBoxRect,
  draggedDepth: number,
  threshold: Threshold
) {
  threshold._setMainThreshold(draggedID, draggedRect, false);

  store._getSiblingKeysByDepth(draggedDepth).forEach((SK) => {
    const elmContainer = store.containers.get(SK)!;

    const boundaries = elmContainer._getBoundaries();

    const insertionLayerKey = combineKeys(draggedDepth, SK);

    threshold._setContainerThreshold(
      SK,
      insertionLayerKey,
      draggedDepth,
      boundaries,
      store.unifiedContainerDimensions[draggedDepth]
    );
  });
}

class DraggableAxes extends DFlexBaseDraggable<DFlexElement> {
  _gridPlaceholder: PointNum;

  _threshold!: Threshold;

  _isViewportRestricted: boolean;

  /**
   * Contains the collection of cycles-id that's done during the session.
   * Session: Starts when dragging is triggered and end with it.
   */
  _session: string[];

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

  private readonly _axesFilterNeeded: boolean;

  readonly _containersTransition: ContainersTransition;

  private readonly _restrictions: Restrictions;

  private readonly _restrictionsStatus: RestrictionsStatus;

  private readonly _marginX: number;

  private readonly _initCoordinates: PointNum;

  _events: DFlexEventPlugin;

  constructor(id: string, initCoordinates: AxesPoint, opts: FinalDndOpts) {
    const [element, DOM] = store.getDOMbyElmID(id);

    super(element, DOM, initCoordinates);

    this.isLayoutStateUpdated = false;

    const {
      _VDOMOrder: VDOMOrder,
      _DOMGrid: DOMGrid,
      _keys: { SK },
      _depth: depth,
      rect,
    } = element;

    this._gridPlaceholder = new PointNum(DOMGrid.x, DOMGrid.y);

    const siblings = store._getElmSiblingsByKey(SK);

    const cycleID = store._tracker._newTravel(PREFIX_CYCLE);

    this._session = [cycleID];

    if (store.migration === null) {
      store.migration = new DFlexCycle(
        VDOMOrder.self,
        this._draggedElm._id,
        SK,
        cycleID,
        // TODO: refactor this to use if the dragged belongs to scroll container or not.
        false
      );
    } else {
      store.migration._add(
        VDOMOrder.self,
        this._draggedElm._id,
        SK,
        cycleID,
        // TODO: refactor this to use if the dragged belongs to scroll container or not.
        false
      );
    }

    this._isViewportRestricted = true;

    // Override containersTransition option when we have an orphan branch.
    this._containersTransition =
      store._getSiblingKeysByDepth(depth).length > 1
        ? opts.containersTransition
        : { ...opts.containersTransition, enable: false };

    initContainers(SK, siblings);

    this._appendDraggedToContainerDimensions(true);

    this._threshold = new Threshold(opts.threshold);

    initThresholds(id, rect, depth, this._threshold);

    const style = getComputedStyle(DOM);

    // get element margin
    const rm = Math.round(parseFloat(style.marginRight));
    const lm = Math.round(parseFloat(style.marginLeft));
    this._marginX = rm + lm;

    const {
      _totalScrollRect: { left, top },
    } = store.scrolls.get(SK)!;

    const { x, y } = initCoordinates;

    this._initCoordinates = new PointNum(x, y);

    this._absoluteInnerOffset = new PointNum(
      Math.round(x - rect.left),
      Math.round(y - rect.top)
    );

    this._viewportInnerOffset = new PointNum(
      Math.round(x - (rect.left - left)),
      Math.round(y - (rect.top - top))
    );

    this._absoluteCurrentPos = new BoxNum(
      rect.top,
      rect.right,
      rect.bottom,
      rect.left
    );

    const viewportTop = rect.top - top;
    const viewportLeft = rect.left - left;

    this._viewportCurrentPos = new BoxNum(
      viewportTop,
      viewportLeft + rect.width,
      viewportTop + rect.height,
      viewportLeft
    );

    if (__DEV__) {
      if (featureFlags.enablePositionAssertion) {
        assertElmPos(DOM, this._viewportCurrentPos);
      }
    }

    this._prevPoint = new PointNum(x, y);

    this._restrictions = opts.restrictions;

    this._restrictionsStatus = opts.restrictionsStatus;

    this._events = initDFlexEvent(DOM);

    this._axesFilterNeeded =
      siblings !== null &&
      (opts.restrictionsStatus.isContainerRestricted ||
        opts.restrictionsStatus.isSelfRestricted);
  }

  protected _appendDraggedToContainerDimensions(isAppend: boolean) {
    const { _depth: depth, rect } = this._draggedElm;

    const maneuverDistance = rect.height;

    store.unifiedContainerDimensions[depth].height += isAppend
      ? maneuverDistance
      : -1 * maneuverDistance;
  }

  private _axesYFilter(
    y: number,
    topThreshold: number,
    bottomThreshold: number,
    allowTop: boolean,
    allowBottom: boolean,
    isRestrictedToThreshold: boolean // if not. Then to self.
  ) {
    const currentTop = y - this._absoluteInnerOffset.y;
    const currentBottom = currentTop + this._draggedElm.rect.height;

    if (!allowTop && currentTop <= topThreshold) {
      return isRestrictedToThreshold
        ? topThreshold + this._absoluteInnerOffset.y
        : this._initCoordinates.y;
    }

    if (!allowBottom && currentBottom >= bottomThreshold) {
      return isRestrictedToThreshold
        ? bottomThreshold +
            this._absoluteInnerOffset.y -
            this._draggedElm.rect.height
        : this._initCoordinates.y;
    }

    return y;
  }

  private _axesXFilter(
    x: number,
    leftThreshold: number,
    rightThreshold: number,
    allowLeft: boolean,
    allowRight: boolean,
    restrictToThreshold: boolean // if not. Then to self.,
  ) {
    const currentLeft = x - this._absoluteInnerOffset.x;
    const currentRight = currentLeft + this._draggedElm.rect.width;

    if (!allowLeft && currentLeft <= leftThreshold) {
      return restrictToThreshold
        ? leftThreshold + this._absoluteInnerOffset.x
        : this._initCoordinates.x;
    }

    if (!allowRight && currentRight + this._marginX >= rightThreshold) {
      return restrictToThreshold
        ? rightThreshold +
            this._absoluteInnerOffset.x -
            this._draggedElm.rect.width -
            this._marginX
        : this._initCoordinates.x;
    }

    return x;
  }

  private _updatePrevPos() {
    const pre = this._viewportCurrentPos;
    this._prevPoint._setAxes(pre.left, pre.top);
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

  _setCurrentPos(
    x: number,
    y: number,
    scrollOffsetX: number,
    scrollOffsetY: number
  ): void {
    this._updatePrevPos();

    const [absEdgePosLeft, absEdgePosTop] = this._getAbsEdgePos(x, y);
    const [edgePosLeft, edgePosTop] = this._getViewportEdgePos(x, y);

    const {
      rect: { width, height },
    } = this._draggedElm;

    const absTop = absEdgePosTop + scrollOffsetY;
    const absLeft = absEdgePosLeft + scrollOffsetX;

    this._absoluteCurrentPos._setBox(
      absTop,
      absLeft + width,
      absTop + height,
      absLeft
    );

    this._viewportCurrentPos._setBox(
      edgePosTop,
      edgePosLeft + width,
      edgePosTop + height,
      edgePosLeft
    );
  }

  _getAbsoluteCurrentPos(): BoxNum {
    return this._absoluteCurrentPos;
  }

  _getViewportCurrentPos(): BoxNum {
    return this._viewportCurrentPos;
  }

  _getDirectionByAxis(axis: Axis): "r" | "l" | "d" | "u" {
    const { x: previousX, y: previousY } = this._prevPoint;
    const { left: currentX, top: currentY } = this._getAbsoluteCurrentPos();

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

  _dragWithOffset(
    x: number,
    y: number,
    scrollOffsetX: number,
    scrollOffsetY: number
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

    const { SK } = store._registry.get(this._draggedElm._id)!._keys;
    const container = store.containers.get(SK)!;

    if (this._axesFilterNeeded) {
      const boundaries = container._getBoundaries();
      const { top, bottom, left: maxLeft, right: minRight } = boundaries;

      if (this._restrictionsStatus.isContainerRestricted) {
        filteredX = this._axesXFilter(
          x,
          maxLeft,
          minRight,
          this._restrictions.container.allowLeavingFromLeft,
          this._restrictions.container.allowLeavingFromRight,
          false
        );
        filteredY = this._axesYFilter(
          y,
          top,
          bottom,
          this._restrictions.container.allowLeavingFromTop,
          this._restrictions.container.allowLeavingFromBottom,
          true
        );
      } else if (this._restrictionsStatus.isSelfRestricted) {
        filteredX = this._axesXFilter(
          x,
          maxLeft,
          minRight,
          this._restrictions.self.allowLeavingFromLeft,
          this._restrictions.self.allowLeavingFromRight,
          false
        );
        filteredY = this._axesYFilter(
          y,
          this._draggedElm.rect.top,
          this._draggedElm.rect.top + this._draggedElm.rect.height,
          this._restrictions.self.allowLeavingFromTop,
          this._restrictions.self.allowLeavingFromBottom,
          false
        );
      }
    } else if (this._isViewportRestricted) {
      const scroll = store.scrolls.get(SK)!;

      // TODO: Test the fix this when scroll is implemented.
      filteredX = this._axesXFilter(
        x,
        0,
        scroll._getMaximumScrollContainerLeft(),
        false,
        false,
        true
      );
      filteredY = this._axesYFilter(
        y,
        0,
        scroll._getMaximumScrollContainerTop(),
        false,
        false,
        true
      );
    }

    this._translate(filteredX, filteredY);

    this._setCurrentPos(filteredX, filteredY, scrollOffsetX, scrollOffsetY);
  }

  _isOutThreshold(SK?: string, useInsertionThreshold?: boolean) {
    const { _id: id, _depth: depth } = this._draggedElm;

    let key = SK || id;

    if (useInsertionThreshold) {
      key = combineKeys(depth, key);
    }

    return this._threshold._isOutThreshold(key, this._absoluteCurrentPos, null);
  }

  _isNotSettled() {
    const { _SK: SK, _index: index } = store.migration._latest();

    const lastElm = store._getElmSiblingsByKey(SK).length - 1;

    const isLeavingFromBottom = index === lastElm;

    return (
      !isLeavingFromBottom &&
      (this._isOutThreshold() || this._isOutThreshold(SK))
    );
  }
}

export default DraggableAxes;
