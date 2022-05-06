import { Container } from "../src";

describe("Container", () => {
  let container: Container;

  beforeAll(() => {
    container = new Container();
  });

  it("container is initiated", () => {
    expect(container).toMatchSnapshot();
  });
});
