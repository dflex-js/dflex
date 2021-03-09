import store from "../../DnDStore";
import Base from "../Base";

const ref = document.createElement("div");

const childInstance1 = {
  id: "id-0",
  depth: 0,
  ref,
};

const childInstance2 = {
  id: "id-1",
  depth: 0,
  ref,
};

const parentInstance = {
  id: "id-p-0",
  depth: 1,
  ref,
};
const DRAGGED_ELM = "draggedElm";

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

      const elementInstance = store.getElmTreeById(childInstance1.id);

      base = new Base(elementInstance, {
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

      const elementInstance = store.getElmTreeById(parentInstance.id);

      base = new Base(elementInstance, {
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
        expect(base.siblingsList).toBe(undefined);
      });

      it("Checks siblings list", () => {
        expect(base.isSingleton).toBe(true);
      });

      it("Detects activeParent", () => {
        expect(base.activeParent).toBe(undefined);
      });
    });
  });
});
