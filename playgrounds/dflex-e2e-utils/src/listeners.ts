/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { ConsoleMessage, expect } from "@playwright/test";

async function assertMutationListenerEmittedMsg(
  msg: ConsoleMessage,
  FINAL_IDS: string[],
) {
  // TODO:
  // cast the type for `emittedMsg`
  const emittedMsg = await msg.args()[1].jsonValue();

  const { type, payload } = emittedMsg;

  expect(type).toBe("mutation");
  expect(payload).toEqual({
    target: "ref: <Node>",
    ids: FINAL_IDS,
  });
}

export { assertMutationListenerEmittedMsg };
