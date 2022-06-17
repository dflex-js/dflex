/* eslint-disable import/no-extraneous-dependencies */
import * as React from "react";
import * as ReactTestUtils from "react-dom/test-utils";
import { Root, createRoot } from "react-dom/client";

import Store from "../src";

// TODO: Add more testing cases to cover all store methods.

describe("Testing Store Package", () => {
  const store = new Store();

  const elm0D0 = {
    id: "id-0",
    depth: 0,
    parentID: "p-id-0",
    readonly: false,
    isInitialized: true,
    isPaused: false,
    scrollX: 0,
    scrollY: 0,
  };

  const elm1D0 = {
    id: "id-1",
    depth: 0,
    parentID: "p-id-0",
    readonly: false,
    isInitialized: true,
    isPaused: false,
    scrollX: 0,
    scrollY: 0,
  };

  const elm2D0 = {
    id: "id-2",
    depth: 0,
    parentID: "p-id-0",
    readonly: false,
    isInitialized: true,
    isPaused: false,
    scrollX: 0,
    scrollY: 0,
  };

  const elm0D1 = {
    id: "p-id-0",
    depth: 1,
    parentID: "",
    readonly: false,
    isInitialized: true,
    isPaused: false,
    scrollX: 0,
    scrollY: 0,
  };

  // const elmThrows = {
  //   id: "id-not-attached",
  //   depth: 1,
  //   parentID: "",
  //   readonly: false,
  //   isInitialized: true,
  //   isPaused: false,
  //   scrollX: 0,
  //   scrollY: 0,
  // };

  let container: HTMLDivElement | null;
  let reactRoot: Root;

  beforeAll(() => {
    container = document.createElement("div");
    reactRoot = createRoot(container);
    document.body.appendChild(container);

    function init() {
      const ref = React.createRef<HTMLDivElement>();

      function TestBase() {
        React.useEffect(() => {
          if (ref.current) {
            [elm0D0, elm1D0, elm2D0, elm0D1].forEach((elm) => {
              store.register(elm);
            });
          }

          return () => {
            [elm0D0, elm1D0, elm2D0, elm0D1].forEach((elm) => {
              store.unregister(elm.id);
            });
          };
        }, [ref]);

        return (
          <div ref={ref} id={elm0D1.id}>
            {[elm0D0, elm1D0, elm2D0].map((elm) => (
              <div id={elm.id} key={elm.id} />
            ))}
          </div>
        );
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

  it("Registers new elements", () => {
    // @ts-ignore - Just for testing purposes.
    expect(store.DOMGen.getElmBranchByKey("0-0")).toStrictEqual([
      "id-0",
      "id-1",
      "id-2",
    ]);

    // @ts-ignore - Just for testing purposes.
    expect(store.DOMGen.getElmBranchByKey("1-1")).toStrictEqual(["p-id-0"]);

    // @ts-ignore - Just for testing purposes.
    expect(store.DOMGen.getElmBranchByKey("2-0")).toStrictEqual([""]);
  });

  it("Snaps shot registry", () => {
    expect(store.registry).toMatchSnapshot();
  });

  it("Returns element instance by element id", () => {
    const elemInstance = store.registry.get(elm0D0.id);

    expect(elemInstance).toMatchSnapshot();
  });

  it("Returns element branch", () => {
    const elemInstance = store.registry.get(elm0D0.id)!;

    const elemBranch = store.getElmBranchByKey(elemInstance.keys.SK);

    expect(elemBranch).toStrictEqual(["id-0", "id-1", "id-2"]);
  });

  it("Snaps shot registry after delete", () => {
    expect(store.registry).toMatchSnapshot();
  });

  // it("Throws because it can't find the reference", () => {
  //   expect(() => store.register(elmThrows)).toThrow();
  // });
});
