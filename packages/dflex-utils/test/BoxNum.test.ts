import { BoxNum } from "../src/Box";

describe("BoxNum", () => {
  let box: BoxNum;

  beforeEach(() => {
    box = new BoxNum(0, 10, 10, 0);
  });

  describe("isIntersect", () => {
    it("should return true if the box intersects with another box", () => {
      const otherBox = new BoxNum(5, 15, 15, 5);
      const result = box.isBoxIntersect(otherBox);
      expect(result).toBe(true);
    });

    it("should return false if the box does not intersect with another box", () => {
      const otherBox = new BoxNum(20, 30, 30, 20);
      const result = box.isBoxIntersect(otherBox);
      expect(result).toBe(false);
    });
  });
});
