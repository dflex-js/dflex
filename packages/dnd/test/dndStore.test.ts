import store from "../src/DnDStore";

import { elm1, elm2, elm3, elm4 } from "./__mocks__/DOMElements";

describe("DnD Store", () => {
  beforeAll(() => {
    store.register(elm1);
  });

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

  describe("getInsertionELmMeta", () => {
    it("Checks orphan branch", () => {
      const {
        element: {
          keys: { SK },
        },
      } = store.getElmTreeById(elm1.id);

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
    });

    it("Checks the last element", () => {
      const {
        element: {
          keys: { SK },
        },
      } = store.getElmTreeById(elm1.id);

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
  });
});
