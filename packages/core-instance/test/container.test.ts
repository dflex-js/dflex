import { Container } from "../src";

describe("Container", () => {
  let container: Container;

  const elmR1Col1 = {
    top: 0,
    left: 0,
    width: 10,
    height: 10,
  };

  const elmR1Col2 = {
    top: 8,
    left: 20,
    width: 10,
    height: 2,
  };

  beforeAll(() => {
    container = new Container();
  });

  it("Container is initiated", () => {
    expect(container).toMatchSnapshot();
  });

  it("Registers two elements in the same row", () => {
    container.registerNewElm(elmR1Col1);

    expect(container.grid.x).toBe(1);
    expect(container.grid.y).toBe(1);

    container.registerNewElm(elmR1Col2);

    expect(container.grid.x).toBe(2);
    expect(container.grid.y).toBe(1);
  });

  it("Container has the correct boundaries", () => {
    expect(container.boundaries).toStrictEqual({
      top: 0,
      left: 0,
      right: 30,
      bottom: 10,
    });
  });
});
