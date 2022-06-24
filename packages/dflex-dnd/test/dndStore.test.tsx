/* eslint-disable import/no-extraneous-dependencies */
import * as React from "react";
import * as ReactTestUtils from "react-dom/test-utils";
import { Root, createRoot } from "react-dom/client";

import { store } from "../src/DnDStore";
import { getInsertionELmMeta } from "../src/Droppable/DFlexUpdater";

describe("DnD Store", () => {
  const elm1 = {
    id: "id-1",
    depth: 0,
    parentID: "",
    readonly: false,
  };

  const elm2 = {
    id: "id-2",
    depth: 0,
    parentID: "",
    readonly: false,
  };

  const elm3 = {
    id: "id-3",
    depth: 0,
    parentID: "",
    readonly: false,
  };

  const elm4 = {
    id: "id-4",
    depth: 0,
    parentID: "",
    readonly: false,
  };

  let container: HTMLDivElement | null;
  let reactRoot: Root;

  const positions: { [k: string]: DOMRect } = {};

  beforeAll(() => {
    container = document.createElement("div");
    reactRoot = createRoot(container);
    document.body.appendChild(container);

    function render(elm: typeof elm3) {
      const ref = React.createRef<HTMLDivElement>();

      React.useEffect(() => {
        if (ref.current) {
          store.register(elm);

          positions[elm.id] = ref.current.getBoundingClientRect();
        }

        return () => {
          store.unregister(elm.id);
        };
      }, [ref]);

      return <div id={elm.id} key={elm.id} ref={ref} />;
    }

    function init() {
      function TestBase() {
        return <div>{[elm1, elm2, elm3, elm4].map((elm) => render(elm))}</div>;
      }

      ReactTestUtils.act(() => {
        reactRoot.render(<TestBase />);
      });
    }

    init();
  });

  afterAll(() => {
    document.body.removeChild(container!);
    container = null;
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
          "parents": Array [],
          "siblings": Array [
            "id-1",
            "id-2",
            "id-3",
            "id-4",
          ],
        }
      `);

      expect(parent).toMatchInlineSnapshot(`undefined`);
    });
  });

  describe("getInsertionELmMeta", () => {
    const preservePosition = {
      x: 1000,
      y: 1000,
    };

    const originLength = 4;

    let SK: string;

    describe("Normal branch without injection", () => {
      it("Checks orphan branch", () => {
        ({
          element: {
            keys: { SK },
          },
        } = store.getElmTreeById(elm1.id));

        const { elm, ...rest } = getInsertionELmMeta(0, SK);

        expect(rest).toMatchInlineSnapshot(`
          Object {
            "isEmpty": false,
            "isOrphan": false,
            "isRestoredLastPosition": false,
            "position": PointNum {
              "x": 0,
              "y": 0,
            },
            "prevElm": null,
          }
        `);
      });

      it("Register three elements in the store", () => {
        store.register(elm2);
        store.register(elm3);
        store.register(elm4);

        // @ts-ignore - this is a test
        expect(store.DOMGen.getElmBranchByKey(SK)).toStrictEqual([
          "id-1",
          "id-2",
          "id-3",
          "id-4",
        ]);
      });

      it("Checks the last element", () => {
        const { elm, prevElm, position, ...rest } = getInsertionELmMeta(3, SK);

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": false,
                  }
              `);

        const pos = positions[elm4.id];

        expect(position.getInstance()).toStrictEqual({
          x: pos.left,
          y: pos.top,
        });

        expect(elm!.id).toBe(elm4.id);
        expect(prevElm!.id).toBe(elm3.id);
      });

      it("Preserve the last element", () => {
        const elmContainer = store.containers.get(SK)!;

        elmContainer.preservePosition(preservePosition);
        elmContainer.originLength = originLength;
      });

      it("Restores the preserved position when calling for last element", () => {
        const { elm, prevElm, position, ...rest } = getInsertionELmMeta(3, SK);

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": true,
                  }
              `);

        expect(position.getInstance()).toStrictEqual(preservePosition);

        expect(elm!.id).toBe(elm4.id);
        expect(prevElm!.id).toBe(elm3.id);
      });

      it("Restores the position even preserved is defined because it's not the last element", () => {
        const { elm, prevElm, position, ...rest } = getInsertionELmMeta(2, SK);

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": true,
                  }
              `);

        const pos = positions[elm3.id];

        expect(position.getInstance()).toStrictEqual({
          x: pos.left,
          y: pos.top,
        });

        expect(elm!.id).toBe(elm3.id);
        expect(prevElm!.id).toBe(elm2.id);
      });

      it("Restores the position for the first element with correct flags", () => {
        const { elm, prevElm, position, ...rest } = getInsertionELmMeta(0, SK);

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": true,
                  }
              `);

        const pos = positions[elm1.id];

        expect(position.getInstance()).toStrictEqual({
          x: pos.left,
          y: pos.top,
        });

        expect(elm!.id).toBe(elm1.id);
        expect(prevElm).toBeNull();
      });
    });

    describe("Injected branch with empty string", () => {
      it("Inject empty string", () => {
        // @ts-ignore - this is a test
        store.DOMGen.addElmIDToBranch(SK, "");

        // @ts-ignore - this is a test
        expect(store.DOMGen.getElmBranchByKey(SK)).toStrictEqual([
          "id-1",
          "id-2",
          "id-3",
          "id-4",
          "",
        ]);
      });

      it("Restores the the last element when the branch is extended", () => {
        const { elm, prevElm, position, ...rest } = getInsertionELmMeta(4, SK);

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": false,
                  }
              `);

        const pos = positions[elm4.id];

        expect(position.getInstance()).toStrictEqual({
          x: pos.left,
          y: pos.top,
        });

        expect(elm!.id).toBe(elm4.id);
        expect(prevElm!.id).toBe(elm3.id);
      });

      it("Restores the position even preserved is defined because it's not the last element", () => {
        const { elm, prevElm, position, ...rest } = getInsertionELmMeta(3, SK);

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": true,
                  }
              `);

        const pos = positions[elm4.id];

        expect(position.getInstance()).toStrictEqual({
          x: pos.left,
          y: pos.top,
        });

        expect(elm!.id).toBe(elm4.id);
        expect(prevElm!.id).toBe(elm3.id);
      });

      it("Restores the position for the first element with correct flags", () => {
        const { elm, prevElm, position, ...rest } = getInsertionELmMeta(0, SK);

        expect(rest).toMatchInlineSnapshot(`
                  Object {
                    "isEmpty": false,
                    "isOrphan": false,
                    "isRestoredLastPosition": true,
                  }
              `);

        const pos = positions[elm1.id];

        expect(position.getInstance()).toStrictEqual({
          x: pos.left,
          y: pos.top,
        });

        expect(elm!.id).toBe(elm1.id);
        expect(prevElm).toBeNull();
      });
    });
  });
});
