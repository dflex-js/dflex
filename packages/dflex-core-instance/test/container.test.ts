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

  beforeAll(() => {
    container = new DFlexParentContainer(3);
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
    expect(container.boundaries).toStrictEqual({
      top: 0,
      right: 30,
      bottom: 10,
      left: 0,
    });
  });

  it("Resets the boundaries and grid", () => {
    container.resetIndicators();

    expect(container.grid.x).toBe(1);
    expect(container.grid.y).toBe(1);
    expect(container.boundaries).toBeNull();
  });

  it("Returns the correct dimensions", () => {
    expect(unifiedContainerDimensions).toStrictEqual({
      height: 10,
      width: 10,
    });
  });
});
