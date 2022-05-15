import store from "../src/DnDStore";
// import DraggableInteractive from "../src/Draggable";
// import DistanceCalculator from "../src/Droppable/DistanceCalculator";
// import extractOpts from "../src/utils/extractOpts";

import { elm1, elm2, elm3, elm4 } from "./__mocks__/DOMElements";

describe("DnD Store", () => {
  beforeAll(() => {
    store.register(elm1);
  });

  describe("Shallow test the store", () => {
    it("Element is initiated", () => {
      store.register(elm1);
      expect(store.registry).toMatchSnapshot();
    });

    it("Returns element branch and parent", () => {
      const { branches, parent } = store.getElmTreeById(elm1.id);

      expect(branches).toMatchInlineSnapshot(`
      Object {
        "parents": undefined,
        "siblings": Array [
          "id-1",
        ],
      }
    `);

      expect(parent).toMatchInlineSnapshot(`null`);
    });
  });

  describe("getInsertionELmMeta", () => {
    const preservePosition = {
      x: 1000,
      y: 1000,
    };

    let SK: string;

    describe("Normal branch without injection", () => {
      it("Checks orphan branch", () => {
        ({
          element: {
            keys: { SK },
          },
        } = store.getElmTreeById(elm1.id));

        const { elm, ...rest } = store.getInsertionELmMeta(0, SK);

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": true,
                    "isRestoredLastPosition": false,
                    "position": PointNum {
                      "x": 450,
                      "y": 114,
                    },
                    "prevElm": null,
                  }
              `);
      });

      it("Register three elements in the store", () => {
        store.register(elm2);
        store.register(elm3);
        store.register(elm4);

        expect(store.DOMGen.branches[SK]).toMatchInlineSnapshot(`
          Array [
            "id-1",
            "id-2",
            "id-3",
            "id-4",
          ]
        `);
      });

      it("Checks the last element", () => {
        const { elm, prevElm, position, ...rest } = store.getInsertionELmMeta(
          3,
          SK
        );

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": false,
                  }
              `);

        const pos = elm4.ref.getBoundingClientRect();

        expect(position.getInstance()).toStrictEqual({
          x: pos.left,
          y: pos.top,
        });

        expect(elm.id).toBe(elm4.id);
        expect(prevElm.id).toBe(elm3.id);
      });

      it("Preserve the last element", () => {
        store.containers[SK].preservePosition(preservePosition);
      });

      it("Restores the preserved position when calling for last element", () => {
        const { elm, prevElm, position, ...rest } = store.getInsertionELmMeta(
          3,
          SK
        );

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": true,
                  }
              `);

        expect(position.getInstance()).toStrictEqual(preservePosition);

        expect(elm.id).toBe(elm4.id);
        expect(prevElm.id).toBe(elm3.id);
      });

      it("Restores the position even preserved is defined because it's not the last element", () => {
        const { elm, prevElm, position, ...rest } = store.getInsertionELmMeta(
          2,
          SK
        );

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": true,
                  }
              `);

        const pos = elm3.ref.getBoundingClientRect();

        expect(position.getInstance()).toStrictEqual({
          x: pos.left,
          y: pos.top,
        });

        expect(elm.id).toBe(elm3.id);
        expect(prevElm.id).toBe(elm2.id);
      });

      it("Restores the position for the first element with correct flags", () => {
        const { elm, prevElm, position, ...rest } = store.getInsertionELmMeta(
          0,
          SK
        );

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": true,
                  }
              `);

        const pos = elm1.ref.getBoundingClientRect();

        expect(position.getInstance()).toStrictEqual({
          x: pos.left,
          y: pos.top,
        });

        expect(elm.id).toBe(elm1.id);
        expect(prevElm).toBeNull();
      });
    });

    describe("Injected branch with empty string", () => {
      it("Inject empty string", () => {
        store.DOMGen.branches[SK].push("");

        expect(store.DOMGen.branches[SK]).toMatchInlineSnapshot(`
          Array [
            "id-1",
            "id-2",
            "id-3",
            "id-4",
            "",
          ]
        `);
      });

      it("Restores the preserved position when calling for last element", () => {
        const { elm, prevElm, position, ...rest } = store.getInsertionELmMeta(
          4,
          SK
        );

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": true,
                  }
              `);

        expect(position.getInstance()).toStrictEqual(preservePosition);

        expect(elm.id).toBe(elm4.id);
        expect(prevElm.id).toBe(elm3.id);
      });

      it("Restores the position even preserved is defined because it's not the last element", () => {
        const { elm, prevElm, position, ...rest } = store.getInsertionELmMeta(
          3,
          SK
        );

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": true,
                  }
              `);

        const pos = elm4.ref.getBoundingClientRect();

        expect(position.getInstance()).toStrictEqual({
          x: pos.left,
          y: pos.top,
        });

        expect(elm.id).toBe(elm4.id);
        expect(prevElm.id).toBe(elm3.id);
      });

      it("Restores the position for the first element with correct flags", () => {
        const { elm, prevElm, position, ...rest } = store.getInsertionELmMeta(
          0,
          SK
        );

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": true,
                  }
              `);

        const pos = elm1.ref.getBoundingClientRect();

        expect(position.getInstance()).toStrictEqual({
          x: pos.left,
          y: pos.top,
        });

        expect(elm.id).toBe(elm1.id);
        expect(prevElm).toBeNull();
      });
    });
  });
});
