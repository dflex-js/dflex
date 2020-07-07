import { createElement, getBoundingClientRect } from "dflex-utils-test";
import { DRAGGED_ELM } from "@dflex/draggable/constants.json";

import Base from "../src/Base";
import { store } from "../../src";

const childInstance1 = createElement({ getBoundingClientRect });
childInstance1.depth = 0;

const childInstance2 = createElement({ getBoundingClientRect });
childInstance2.depth = 0;

const parentInstance = createElement({
  children: [childInstance1.element, childInstance2.element],
  getBoundingClientRect,
});
parentInstance.depth = 1;

beforeAll(() => {
  store.register(childInstance1);
  store.register(childInstance2);

  store.register(parentInstance);
});

let base;

describe("DND - PKG: Base", () => {
  describe("Testing child", () => {
    beforeAll(() => {
      const START_CLIENT_X = 10;
      const START_CLIENT_Y = 20;

      base = new Base(childInstance1.id, {
        x: START_CLIENT_X,
        y: START_CLIENT_Y,
      });
    });

    describe("Testing flags and relations", () => {
      it("Checks node siblings", () => {
        expect(base.isSingleton).toBe(false);
      });

      it("Checks node parent", () => {
        expect(base.isOrphan).toBe(false);
      });

      it("Checks parent list", () => {
        expect(base.parentsList).toBe(parentInstance.id);
      });

      it("Checks siblings list", () => {
        expect(base.siblingsList).toStrictEqual([
          childInstance1.id,
          childInstance2.id,
        ]);
      });

      it("Detects activeParent", () => {
        expect(base.activeParent.id).toBe(parentInstance.id);
      });
    });

    describe("Threshold", () => {
      it("Calculates threshold Offset", () => {
        expect(base[DRAGGED_ELM].thresholdOffset).toMatchSnapshot();
      });

      it("Calculates thresholds for dragged as dropped", () => {
        expect(base.thresholds.dragged).toMatchSnapshot();
      });

      it("Calculates thresholds for parent as dropped", () => {
        expect(base.thresholds.parents).toMatchSnapshot();
      });
    });
  });

  describe("Testing parent", () => {
    beforeAll(() => {
      const START_CLIENT_X = 10;
      const START_CLIENT_Y = 20;

      base = new Base(parentInstance.id, {
        x: START_CLIENT_X,
        y: START_CLIENT_Y,
      });
    });

    describe("Testing flags and relations", () => {
      it("Checks node siblings", () => {
        expect(base.isSingleton).toBe(true);
      });

      it("Checks node parent", () => {
        expect(base.isOrphan).toBe(true);
      });

      it("Checks parent list", () => {
        expect(base.parentsList).toBe(undefined);
      });

      it("Checks siblings list", () => {
        expect(base.siblingsList).toBe(parentInstance.id);
      });

      it("Detects activeParent", () => {
        expect(base.activeParent).toBe(undefined);
      });
    });
  });
});
