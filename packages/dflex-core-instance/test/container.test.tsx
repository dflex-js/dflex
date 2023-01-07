/* eslint-disable import/no-extraneous-dependencies */
import * as React from "react";
import * as ReactTestUtils from "react-dom/test-utils";
import { Root, createRoot } from "react-dom/client";

import { DFlexParentContainer } from "../src";

// TODO: Add more cases to cover the grid. This is just a shallow test.
describe("Container", () => {
  let container: DFlexParentContainer;

  const elmR1Col1 = {
    height: 10,
    width: 10,
    top: 0,
    right: 10,
    bottom: 10,
    left: 0,
  };

  const elmR1Col2 = {
    height: 2,
    width: 10,
    top: 8,
    right: 30,
    bottom: 10,
    left: 20,
  };

  const unifiedContainerDimensions = {
    height: 0,
    width: 0,
  };

  let docContainer: HTMLDivElement | null;
  let reactRoot: Root;

  const containerID = "id-parent-container";

  beforeAll(() => {
    docContainer = document.createElement("div");
    reactRoot = createRoot(docContainer);
    document.body.appendChild(docContainer);

    function init() {
      const ref = React.createRef<HTMLDivElement>();

      function TestBase() {
        React.useEffect(() => {
          if (ref.current) {
            container = new DFlexParentContainer(ref.current, 3, containerID);
          }

          return () => {};
        }, [ref]);

        return (
          <div>
            <div ref={ref} id={containerID}></div>
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
    document.body.removeChild(docContainer!);
    docContainer = null;
  });

  it("Registers two elements in the same row", () => {
    container.registerNewElm(elmR1Col1, unifiedContainerDimensions);

    expect(container.grid.x).toBe(1);
    expect(container.grid.y).toBe(1);

    container.registerNewElm(elmR1Col2, unifiedContainerDimensions);

    expect(container.grid.x).toBe(2);
    expect(container.grid.y).toBe(1);
  });

  it("Returns the correct dimensions", () => {
    expect(unifiedContainerDimensions).toStrictEqual({
      height: 10,
      width: 10,
    });
  });

  it("Container has the correct boundaries", () => {
    expect(container.getBoundaries()).toStrictEqual({
      top: 0,
      right: 30,
      bottom: 10,
      left: 0,
    });
  });

  it("Resets the boundaries and grid", () => {
    container.resetIndicators(3);

    expect(container.grid.x).toBe(1);
    expect(container.grid.y).toBe(1);
    // expect(container.boundaries).toBeNull();
  });

  it("Returns the correct dimensions", () => {
    expect(unifiedContainerDimensions).toStrictEqual({
      height: 10,
      width: 10,
    });
  });
});
