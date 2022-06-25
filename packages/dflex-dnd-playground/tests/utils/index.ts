import type { Page, Locator } from "@playwright/test";

let page: Page;
let steps = 0;
export function initialize(createdPage: Page, mouseSteps: number = 5) {
  page = createdPage;
  steps = mouseSteps;
}

export type DraggedRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
let startingPointX: number;
let startingPointY: number;
let accStepsX = 0;
let accStepsY = 0;

export async function getDraggedRect(dragged: Locator) {
  const draggedRect = await dragged.boundingBox()!;

  if (!draggedRect) {
    throw new Error("Dragged element is not found");
  }

  startingPointX = draggedRect.x + draggedRect.width / 2;
  startingPointY = draggedRect.y + draggedRect.height / 2;

  accStepsX = 0;
  accStepsY = 0;

  await page.mouse.move(startingPointX, startingPointY, {
    steps: 1,
  });

  await page.mouse.down({ button: "left", clickCount: 1 });

  return draggedRect;
}

export async function moveDragged(stepsX: number, stepsY: number) {
  if (stepsX !== -1) {
    accStepsX = stepsX;
  }
  if (stepsY !== -1) {
    accStepsY = stepsY;
  }

  await page.mouse.move(
    startingPointX + accStepsX,
    startingPointY + accStepsY,
    {
      steps,
    }
  );
}
