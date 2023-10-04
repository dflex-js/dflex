import { BoxNum } from "../Box";

import type { Axis } from "../types";

type MovementDirection = "r" | "l" | "d" | "u";

type ThresholdDeadZoneMovement = {
  x: MovementDirection | null;
  y: MovementDirection | null;
};

const INITIAL_MOVEMENT: ThresholdDeadZoneMovement = { x: null, y: null };

/**
 * Represents a threshold dead zone used to manage the stabilizing zone that prevents
 * the dragged element from getting stuck between two intersected thresholds.
 */
class ThresholdDeadZone {
  /**
   * A bounding box representing the threshold dead zone.
   */
  private _area: BoxNum;

  /**
   * Indicates movement directions for each axis (x and y).
   */
  private _movement: ThresholdDeadZoneMovement;

  constructor() {
    this._area = new BoxNum(0, 0, 0, 0);
    this._movement = { ...INITIAL_MOVEMENT };

    if (__DEV__) {
      Object.seal(this);
    }
  }

  setDeadZone(
    axis: Axis,
    movementDirection: MovementDirection,
    firstThreshold: BoxNum,
    secondThreshold: BoxNum,
  ): void {
    // Calculate the surrounding bounding box for the stabilizing zone.
    const surroundingBox = firstThreshold.getSurroundingBox(secondThreshold);

    // Store the calculated area as the dead zone stabilizer.
    this._area.clone(surroundingBox);

    // Record the direction of movement on the specified axis.
    this._movement[axis] = movementDirection;
  }

  /**
   * Checks if the dragged element is inside the threshold dead zone.
   *
   * @param axis - The axis along which the movement is occurring ('x' or 'y').
   * @param movementDirection - The direction of movement on the specified axis.
   * @param draggedPos - The position of the dragged element.
   * @returns True if the dragged element is inside the dead zone with matching
   * movement direction, otherwise false.
   */
  isInside(
    axis: Axis,
    movementDirection: MovementDirection,
    draggedPos: BoxNum,
  ): boolean {
    const isInsideDeadZone = draggedPos.isInsideThreshold(this._area);

    if (isInsideDeadZone) {
      const hasMatchingDir = movementDirection === this._movement[axis];

      return hasMatchingDir;
    }

    return false;
  }

  /**
   * Clears the area and movement values, resetting them to their initial state.
   */
  clear(): void {
    this._area.setBox(0, 0, 0, 0);
    this._movement = { ...INITIAL_MOVEMENT };
  }
}

export default ThresholdDeadZone;
