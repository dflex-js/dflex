/* eslint-disable import/no-extraneous-dependencies */
import * as React from "react";
import * as ReactTestUtils from "react-dom/test-utils";
import { Root, createRoot } from "react-dom/client";

import { PointNum } from "@dflex/utils";
import { store } from "../src/LayoutManager";

describe("DFlex DnD", () => {
  const elm1 = {
    id: "id-1",
    depth: 0,
    readonly: false,
  };

  const elm2 = {
    id: "id-2",
    depth: 0,
    readonly: false,
  };

  const elm3 = {
    id: "id-3",
    depth: 0,
    readonly: false,
  };

  const elm4 = {
    id: "id-4",
    depth: 0,
    readonly: false,
  };

  let container: HTMLDivElement | null;
  let reactRoot: Root;

  const positions: Record<string, DOMRect> = {};

  beforeAll(() => {
    jest.useFakeTimers();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    container = document.createElement("div");
    reactRoot = createRoot(container);
    document.body.appendChild(container);

    function DnDComponent(elm: typeof elm3) {
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
        const ref = React.createRef<HTMLDivElement>();

        return (
          <div ref={ref}>
            <div>
              <DnDComponent {...elm1} />
            </div>
            <div>{[elm2, elm3, elm4].map((elm) => DnDComponent(elm))}</div>
          </div>
        );
      }

      ReactTestUtils.act(() => {
        reactRoot.render(<TestBase />);
      });
    }

    init();
    jest.runAllTimers();
  });

  afterAll(() => {
    document.body.removeChild(container!);
    container = null;
  });

  describe("DFlex DnD Store registration", () => {
    it("Element is initiated", () => {
      store.register(elm1);
      expect(store).toMatchSnapshot();
    });

    describe("Checking the two branches, depth and keys", () => {
      it("Store has two branches", () => {
        expect(store.getBranchesByDepth(0).length).toBe(2);
      });

      it("Store depth zero matches branches Siblings key(SK)", () => {
        const branches = store.getBranchesByDepth(0);

        expect(branches[0]).toBe(store.registry.get(elm1.id)!.keys.SK);
        expect(branches[1]).toBe(store.registry.get(elm2.id)!.keys.SK);
      });
    });

    describe("Checking containers", () => {
      it("Store has two containers matching the two branches", () => {
        expect(store.containers.size).toBe(2);
      });

      it("Containers have the correct origin length", () => {
        const container1 = store.containers.get(
          store.registry.get(elm1.id)!.keys.SK
        )!;

        expect(container1.originLength).toBe(1);

        const container2 = store.containers.get(
          store.registry.get(elm2.id)!.keys.SK
        )!;

        expect(container2.originLength).toBe(3);
      });

      it.skip("Containers initialized `lastElmPosition`", () => {
        const container1 = store.containers.get(
          store.registry.get(elm1.id)!.keys.SK
        )!;

        expect(container1.lastElmPosition).toBeInstanceOf(PointNum);

        const container2 = store.containers.get(
          store.registry.get(elm2.id)!.keys.SK
        )!;

        expect(container2.lastElmPosition).toBeInstanceOf(PointNum);
      });
    });

    describe("Checking interactiveDOM", () => {
      it("interactiveDOM has all elements DOM", () => {
        [elm1, elm2, elm3, elm4].forEach((elm) => {
          expect(store.interactiveDOM.has(elm.id)).toBe(true);
        });
      });

      it("interactiveDOM has also the parent containers", () => {
        expect(store.interactiveDOM.size).toBe(6);
      });

      it("Elements have the right dataset", () => {
        [elm1].forEach((elm, i) => {
          expect(store.interactiveDOM.get(elm.id)!.dataset.index).toBe(`${i}`);
        });

        [elm2, elm3, elm4].forEach((elm, i) => {
          expect(store.interactiveDOM.get(elm.id)!.dataset.index).toBe(`${i}`);
        });
      });
    });
  });
});
