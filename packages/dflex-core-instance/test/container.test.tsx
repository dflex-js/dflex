/* eslint-disable no-underscore-dangle */
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
            container = new DFlexParentContainer(
              containerID,
              ref.current,
              3,
              // @ts-ignore
              {
                left: 0,
                top: 0,
              },
            );
          }

          return () => {};
        }, [ref]);

        return (
          <div>
            <div ref={ref} id={containerID} />
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
    container.register(elmR1Col1, unifiedContainerDimensions);

    // @ts-expect-error
    expect(container._gridIndex.x).toBe(0);
    // @ts-expect-error
    expect(container._gridIndex.y).toBe(0);

    container.register(elmR1Col2, unifiedContainerDimensions);

    // @ts-expect-error
    expect(container._gridIndex.x).toBe(1);
    // @ts-expect-error
    expect(container._gridIndex.y).toBe(0);
  });

  it("Returns the correct dimensions", () => {
    expect(unifiedContainerDimensions).toStrictEqual({
      height: 10,
      width: 10,
    });
  });

  it("Container has the correct boundaries", () => {
    expect(container.getBoundaries()).toMatchObject({
      top: 0,
      right: 30,
      bottom: 10,
      left: 0,
    });
  });

  it("Resets the boundaries and grid", () => {
    container.resetIndicators(3);

    // @ts-expect-error
    expect(container._gridIndex.x).toBe(-1);
    // @ts-expect-error
    expect(container._gridIndex.y).toBe(-1);
    // expect(container.boundaries).toBeNull();
  });

  it("Returns the correct dimensions", () => {
    expect(unifiedContainerDimensions).toStrictEqual({
      height: 10,
      width: 10,
    });
  });
});
