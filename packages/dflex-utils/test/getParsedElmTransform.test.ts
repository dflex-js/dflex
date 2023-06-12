import { getParsedElmTransform } from "../src";

describe("getParsedElmTransform", () => {
  test("returns null for empty transform value", () => {
    const element = document.createElement("div");
    element.style.transform = "";

    const result = getParsedElmTransform(element);

    expect(result).toBeNull();
  });

  test("returns null for element without transform property", () => {
    const element = document.createElement("div");

    const result = getParsedElmTransform(element);

    expect(result).toBeNull();
  });

  test("returns null for transform with other functions", () => {
    const element = document.createElement("div");
    element.style.transform = "scale(2) rotate(45deg)";

    const result = getParsedElmTransform(element);

    expect(result).toBeNull();
  });

  test("returns parsed transform matrix", () => {
    const element = document.createElement("div");
    element.style.transform = "matrix(1, 0, 0, 1, 10, 20)";

    const result = getParsedElmTransform(element);

    expect(result).toEqual([10, 20]);
  });

  test("returns parsed transform matrix from multiple transform functions", () => {
    const element = document.createElement("div");
    element.style.transform =
      "translateX(50px) scale(2) matrix(1, 0, 0, 1, 30, 40)";

    const result = getParsedElmTransform(element);

    expect(result).toEqual([30, 40]);
  });
});
