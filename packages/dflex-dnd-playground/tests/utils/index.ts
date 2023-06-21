import { Page, Locator, expect, ConsoleMessage } from "@playwright/test";

export { DFlexPageTest } from "./DFlexPageTest";

let page: Page;
let steps = 0;

export function initialize(
  createdPage: Page,
  browserName?: string,
  mouseSteps: number = browserName ? (browserName === "chromium" ? 5 : 40) : 5
) {
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

export async function invokeKeyboard(k = "c") {
  await page.keyboard.press(k);
}

async function assertEmittedMsg(msg: ConsoleMessage, FINAL_IDS: string[]) {
  // TODO:
  // cast the type for `emittedMsg`
  const emittedMsg = await msg.args()[1].jsonValue();

  const { type, status, payload } = emittedMsg;

  expect(type).toBe("mutation");
  expect(status).toBe("committed");
  expect(payload).toEqual({
    target: "ref: <Node>",
    ids: FINAL_IDS,
  });
}

export async function assertConsoleMsg(FINAL_IDS: string[]) {
  // Get the next console log
  const [msg] = await Promise.all([page.waitForEvent("console")]);

  await assertEmittedMsg(msg, FINAL_IDS);
}

export async function invokeKeyboardAndAssertEmittedMsg(FINAL_IDS: string[]) {
  // Get the next console log
  const [msg] = await Promise.all([
    page.waitForEvent("console"),
    invokeKeyboard(),
  ]);

  await assertEmittedMsg(msg, FINAL_IDS);
}

export async function assertChildrenOrderIDs(
  parentLocater: Locator,
  FINAL_IDS: string[]
) {
  const childrenIDs = await parentLocater.evaluate((elm) => {
    const ids: string[] = [];
    for (let i = 0; i < elm.children.length; i += 1) {
      ids.push(elm.children[i].id);
    }
    return ids;
  });

  expect(childrenIDs).toEqual(FINAL_IDS);
}

export async function getChildrenLength(parentLocater: Locator) {
  return parentLocater.evaluate((elm) => {
    return elm.children.length;
  });
}

export async function assertDefaultChildrenIndex(parentLocater: Locator) {
  const [childrenIndex, childrenLength] = await parentLocater.evaluate(
    (parentElm) => {
      const indexes: string[] = [];
      const { length } = parentElm.children;

      for (let i = 0; i < length; i += 1) {
        indexes.push(parentElm.children[i].getAttribute("data-index")!);
      }
      return [indexes, length];
    }
  );

  expect(childrenIndex).toEqual(
    Array.from(Array(childrenLength), (_, i) => `${i}`)
  );
}

export async function assertChildrenGrid(
  parentLocater: Locator,
  expectedChildrenGrid: { x: number; y: number }[]
) {
  const childrenGrid = await parentLocater.evaluate((parentElm) => {
    const grid: { x: number; y: number }[] = [];

    const { length } = parentElm.children;

    for (let i = 0; i < length; i += 1) {
      const child = parentElm.children[i];

      const x = Number(child.getAttribute("data-dev-x") || 0);
      const y = Number(child.getAttribute("data-dev-y") || 0);

      grid.push({ x, y });
    }

    return grid;
  });

  expect(childrenGrid).toEqual(expectedChildrenGrid);
}

export const TransformTimeout = {
  timeout: 30000,
};
