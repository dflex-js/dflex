/* eslint-disable import/no-extraneous-dependencies */
import * as React from "react";
import * as ReactTestUtils from "react-dom/test-utils";
import { Root, createRoot } from "react-dom/client";

import { store } from "../src";

describe("Draggable Store", () => {
  const elm0D0 = {
    id: "id-0",
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
            store.register(elm0D0.id);
          }

          return () => {
            store.unregister(elm0D0.id);
          };
        }, [ref]);

        return <div ref={ref} id={elm0D0.id}></div>;
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
    jest.restoreAllMocks();
  });

  it("Registry is not empty", () => {
    expect(store.registry).toBeTruthy();
  });

  it("Registers element and initiates translateX,Y", () => {
    expect(store.registry).toMatchSnapshot();
  });
});
