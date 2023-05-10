import { BoxNum } from "../src/Box";

describe("BoxNum", () => {
  let box: BoxNum;

  beforeEach(() => {
    box = new BoxNum(0, 10, 10, 0);
  });

  describe("isIntersect", () => {
    it("should return true if the box intersects with another box", () => {
      const otherBox = new BoxNum(5, 15, 15, 5);
      const result = box.isIntersect(otherBox);
      expect(result).toBe(true);
    });

    it("should return false if the box does not intersect with another box", () => {
      const otherBox = new BoxNum(20, 30, 30, 20);
      const result = box.isIntersect(otherBox);
      expect(result).toBe(false);
    });
  });

  describe("isNotIntersect", () => {
    it("should return false if the box intersects with another box", () => {
      const otherBox = new BoxNum(5, 15, 15, 5);
      const result = box.isNotIntersect(otherBox);
      expect(result).toBe(false);
    });

    it("should return true if the box does not intersect with another box", () => {
      const otherBox = new BoxNum(20, 30, 30, 20);
      const result = box.isNotIntersect(otherBox);
      expect(result).toBe(true);
    });

    it("should return true if the box is completely above another box", () => {
      const otherBox = new BoxNum(-10, 10, -5, 0);
      const result = box.isNotIntersect(otherBox);
      expect(result).toBe(true);
    });

    it("should return true if the box is completely on the right of another box", () => {
      const otherBox = new BoxNum(0, 20, 10, 15);
      const result = box.isNotIntersect(otherBox);
      expect(result).toBe(true);
    });

    it("should return true if the box is completely on the right of another box", () => {
      const otherBox = new BoxNum(-5, -1, 5, -10);
      const result = box.isNotIntersect(otherBox);
      expect(result).toBe(true);
    });

    it("should return true if the box is completely below another box", () => {
      const otherBox = new BoxNum(20, 30, 30, 20);
      const result = box.isNotIntersect(otherBox);
      expect(result).toBe(true);
    });
  });

  describe("isOutside", () => {
    it("should return false if the box is completely inside another box", () => {
      const otherBox = new BoxNum(-5, 15, 15, -5);
      const result = box.isOutside(otherBox);
      expect(result).toBe(false);
    });

    it("should return false if the box is partially outside another box on the top side", () => {
      const otherBox = new BoxNum(-5, 10, 5, 0);
      const result = box.isOutside(otherBox);
      expect(result).toBe(false);
    });

    it("should return false if the box is partially outside another box on the right side", () => {
      const otherBox = new BoxNum(0, 15, 15, 5);
      const result = box.isOutside(otherBox);
      expect(result).toBe(false);
    });

    it("should return false if the box is partially outside another box on the bottom side", () => {
      const otherBox = new BoxNum(5, 10, 15, 0);
      const result = box.isOutside(otherBox);
      expect(result).toBe(false);
    });

    it("should return false if the box is partially outside another box on the left side", () => {
      const otherBox = new BoxNum(0, 10, 15, -5);
      const result = box.isOutside(otherBox);
      expect(result).toBe(false);
    });

    it("should return true if the box is completely outside another box on the top side", () => {
      const otherBox = new BoxNum(10, 15, 15, -5);
      const result = box.isOutside(otherBox);
      expect(result).toBe(true);
    });

    it("should return true if the box is completely outside another box on the right side", () => {
      const otherBox = new BoxNum(0, 15, 15, 20);
      const result = box.isOutside(otherBox);
      expect(result).toBe(true);
    });

    it("should return true if the box is completely outside another box on the bottom side", () => {
      const otherBox = new BoxNum(20, 5, 25, 15);
      const result = box.isOutside(otherBox);
      expect(result).toBe(true);
    });

    it("should return true if the box is completely outside another box on the left side", () => {
      const otherBox = new BoxNum(0, -10, 15, -5);
      const result = box.isOutside(otherBox);
      expect(result).toBe(true);
    });
  });
});
