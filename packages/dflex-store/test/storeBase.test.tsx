/* eslint-disable import/no-extraneous-dependencies */
import * as React from "react";
import * as ReactTestUtils from "react-dom/test-utils";
import { Root, createRoot } from "react-dom/client";

import BaseStore from "../src";

describe("Testing DFlex BaseStore", () => {
  const store = new BaseStore();

  const elm0DP0 = {
    id: "id-0",
    depth: 0,
    readonly: false,
    animation: null,
  };

  const elm1DP0 = {
    id: "id-1",
    depth: 0,
    readonly: false,
    animation: null,
  };

  const elm2DP0 = {
    id: "id-2",
    depth: 0,
    readonly: false,
    animation: null,
  };

  const elm0DP1 = {
    id: "p-id-0",
    depth: 1,
    readonly: false,
    animation: null,
  };

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
            [elm0DP0, elm1DP0, elm2DP0, elm0DP1].forEach((elm) => {
              store.register(elm);
            });
          }

          return () => {
            [elm0DP0, elm1DP0, elm2DP0, elm0DP1].forEach((elm) => {
              store.unregister(elm.id);
            });
          };
        }, [ref]);

        return (
          <div>
            <div ref={ref} id={elm0DP1.id}>
              {[elm0DP0, elm1DP0, elm2DP0].map((elm) => (
                <div id={elm.id} key={elm.id} />
              ))}
            </div>
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

  it("Store registered all elements", () => {
    [elm0DP0, elm1DP0, elm2DP0, elm0DP1].forEach((elm) => {
      expect(store.has(elm.id)).toBe(true);
    });
  });

  it("Chaining works correctly", () => {
    const { keys: parentKeys } = store.registry.get(elm0DP1.id)!;

    let SK: string;
    let BK: string;

    [elm0DP0, elm1DP0, elm2DP0].forEach((elm) => {
      const { keys } = store.registry.get(elm.id)!;

      if (!SK) {
        SK = keys.SK;
        BK = keys.BK;
      }

      // Child parent key with parent sibling key.
      expect(keys.PK).toBe(parentKeys.CHK);

      // Child sibling key with parent children key.
      expect(keys.SK).toBe(SK);
      expect(keys.BK).toBe(BK);

      expect(keys.CHK).toBeNull();
    });
  });

  it("Siblings belong to the same branch", () => {
    const { keys } = store.registry.get(elm0DP0.id)!;

    expect(store.getElmSiblingsByKey(keys.SK)).toStrictEqual([
      elm0DP0.id,
      elm1DP0.id,
      elm2DP0.id,
    ]);
  });

  it("Parents belong to the same branch", () => {
    const { keys } = store.registry.get(elm0DP1.id)!;

    expect(store.getElmSiblingsByKey(keys.SK)).toStrictEqual([elm0DP1.id]);
  });

  it("Children have the correct dataset index", () => {
    expect(store.interactiveDOM.get(elm0DP0.id)!.dataset.index).toBe("0");
    expect(store.interactiveDOM.get(elm1DP0.id)!.dataset.index).toBe("1");
    expect(store.interactiveDOM.get(elm2DP0.id)!.dataset.index).toBe("2");
  });
});
