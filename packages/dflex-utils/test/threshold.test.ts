import { combineKeys } from "../src/collections";
import { DFlexThreshold } from "../src/Threshold";
import type { Dimensions } from "../src/types";

describe("DFlexThreshold", () => {
  const DEFAULT_IS_OUT_INDICATORS = {
    top: false,
    right: false,
    bottom: false,
    left: false,
  };

  describe("Dragged Threshold", () => {
    let threshold: DFlexThreshold;

    const DRAGGED = {
      ID: "dflex-dragged",
      DP: 0,
      RECT: {
        height: 50,
        width: 170,
        top: 114,
        right: 620,
        bottom: 164,
        left: 450,
      },
      THRESHOLD: {
        top: 84,
        bottom: 194,
        left: 348,
        right: 722,
      },
    };

    const CONTAINER = {
      SK: "container-sk",
      RECT: {
        height: 50,
        width: 170,
        top: 114,
        right: 192,
        bottom: 164,
        left: 22,
      },
      THRESHOLD: {
        bottom: 194,
        left: -80,
        right: 294,
        top: 84,
      },
    };

    const DEPTH = {
      THRESHOLD: {
        // heigh: 518,
        // width: 643,
        top: 54,
        right: 450,
        bottom: 572,
        left: -182,
      },
    };

    const INSERTION_LAYER = {
      key: combineKeys(DRAGGED.DP, CONTAINER.SK),
      THRESHOLD: { bottom: 542, left: -80, right: 348, top: 84 },
    };

    const UNIFIED_CONTAINER_DIMENSION: Dimensions = {
      height: 398,
      width: 224,
    };

    const pixels = {
      x: 102,
      y: 30,
    };

    beforeAll(() => {
      const thresholdInput = {
        vertical: 60,
        horizontal: 60,
      };

      threshold = new DFlexThreshold(thresholdInput);
    });

    afterAll(() => {
      threshold.destroy();
    });

    describe("Main threshold", () => {
      it("Should be defined before setting the keys", () => {
        expect(threshold).toBeDefined();
        expect(threshold.isOut).toStrictEqual({});
        expect(threshold.thresholds).toStrictEqual({});
      });

      it("Add main outer threshold for dragged", () => {
        threshold.setMainThreshold(DRAGGED.ID, DRAGGED.RECT, false);

        expect(threshold.isOut[DRAGGED.ID]).toMatchObject(
          DEFAULT_IS_OUT_INDICATORS
        );

        expect(threshold.thresholds[DRAGGED.ID]).toStrictEqual(
          DRAGGED.THRESHOLD
        );
      });

      it("Outer threshold is bigger than input rect", () => {
        expect(threshold.thresholds[DRAGGED.ID].bottom).toBeGreaterThan(
          DRAGGED.RECT.top + DRAGGED.RECT.height
        );

        expect(threshold.thresholds[DRAGGED.ID].top).toBeLessThan(
          DRAGGED.RECT.top
        );

        expect(threshold.thresholds[DRAGGED.ID].left).toBeLessThan(
          DRAGGED.RECT.left
        );

        expect(threshold.thresholds[DRAGGED.ID].right).toBeGreaterThan(
          DRAGGED.RECT.left + DRAGGED.RECT.width
        );
      });

      it("Calculate the threshold correctly", () => {
        expect(DRAGGED.RECT.top + DRAGGED.RECT.height + pixels.y).toBe(
          threshold.thresholds[DRAGGED.ID].bottom
        );

        expect(DRAGGED.RECT.top - pixels.y).toBe(
          threshold.thresholds[DRAGGED.ID].top
        );

        expect(DRAGGED.RECT.left + DRAGGED.RECT.width + pixels.x).toBe(
          threshold.thresholds[DRAGGED.ID].right
        );

        expect(DRAGGED.RECT.left - pixels.x).toBe(
          threshold.thresholds[DRAGGED.ID].left
        );
      });

      it("Throw when adding the same key", () => {
        expect(() => {
          threshold.setMainThreshold(DRAGGED.ID, DRAGGED.RECT, false);
        }).toThrow();
      });
    });

    describe("Container threshold", () => {
      it("Add threshold for container, it's inner by default", () => {
        threshold.setContainerThreshold(
          CONTAINER.SK,
          INSERTION_LAYER.key,
          DRAGGED.DP,
          CONTAINER.RECT,
          UNIFIED_CONTAINER_DIMENSION
        );

        expect(threshold).toMatchSnapshot();
      });

      it("Outer threshold is bigger than input rect", () => {
        expect(threshold.thresholds[CONTAINER.SK].bottom).toBeGreaterThan(
          CONTAINER.RECT.bottom
        );

        expect(threshold.thresholds[CONTAINER.SK].top).toBeLessThan(
          CONTAINER.RECT.top
        );

        expect(threshold.thresholds[CONTAINER.SK].left).toBeLessThan(
          CONTAINER.RECT.left
        );

        expect(threshold.thresholds[CONTAINER.SK].right).toBeGreaterThan(
          CONTAINER.RECT.right
        );
      });

      it("Calculate the threshold correctly", () => {
        expect(CONTAINER.RECT.bottom + pixels.y).toBe(
          threshold.thresholds[CONTAINER.SK].bottom
        );

        expect(CONTAINER.RECT.top - pixels.y).toBe(
          threshold.thresholds[CONTAINER.SK].top
        );

        expect(CONTAINER.RECT.right + pixels.x).toBe(
          threshold.thresholds[CONTAINER.SK].right
        );

        expect(CONTAINER.RECT.left - pixels.x).toBe(
          threshold.thresholds[CONTAINER.SK].left
        );
      });

      it("Define threshold for container", () => {
        expect(threshold.thresholds[CONTAINER.SK]).toStrictEqual(
          CONTAINER.THRESHOLD
        );

        expect(threshold.isOut[CONTAINER.SK]).toMatchObject(
          DEFAULT_IS_OUT_INDICATORS
        );
      });

      it("Throw when adding the same container key", () => {
        expect(() => {
          threshold.setContainerThreshold(
            CONTAINER.SK,
            INSERTION_LAYER.key,
            DRAGGED.DP,
            CONTAINER.RECT,
            UNIFIED_CONTAINER_DIMENSION
          );
        }).toThrow();
      });

      it("Define threshold for accumulated depth", () => {
        expect(threshold.thresholds[DRAGGED.DP]).toStrictEqual(DEPTH.THRESHOLD);

        expect(threshold.isOut[DRAGGED.DP]).toMatchObject(
          DEFAULT_IS_OUT_INDICATORS
        );
      });

      it("Define threshold for biggest container in the given depth", () => {
        expect(threshold.thresholds[INSERTION_LAYER.key]).toStrictEqual(
          INSERTION_LAYER.THRESHOLD
        );

        expect(threshold.isOut[INSERTION_LAYER.key]).toMatchObject(
          DEFAULT_IS_OUT_INDICATORS
        );
      });
    });
  });

  describe("Scroll Threshold", () => {
    let threshold: DFlexThreshold;

    const SCROLL = {
      ID_INNER: "scroll-id-inner",
      ID_OUTER: "scroll-id-outer",
      RECT: {
        top: 0,
        right: 885,
        bottom: 657,
        left: 0,
        height: 657,
        width: 885,
      },
      THRESHOLD_INNER: {
        top: 99,
        left: 133,
        bottom: 558,
        right: 752,
      },
      THRESHOLD_OUTER: {
        top: -99,
        left: -133,
        bottom: 756,
        right: 1018,
      },
    };

    const pixels = {
      x: 133,
      y: 99,
    };

    beforeAll(() => {
      const thresholdInput = {
        vertical: 15,
        horizontal: 15,
      };

      threshold = new DFlexThreshold(thresholdInput);
    });

    afterAll(() => {
      threshold.destroy();
    });

    describe("Scroll inner threshold", () => {
      it("Should be defined before setting the keys", () => {
        expect(threshold).toBeDefined();
        expect(threshold.isOut).toStrictEqual({});
        expect(threshold.thresholds).toStrictEqual({});
      });

      it("Add main inner threshold for scroll", () => {
        threshold.setMainThreshold(SCROLL.ID_INNER, SCROLL.RECT, true);

        expect(threshold).toMatchSnapshot();

        expect(threshold.isOut[SCROLL.ID_INNER]).toMatchObject(
          DEFAULT_IS_OUT_INDICATORS
        );

        expect(threshold.thresholds[SCROLL.ID_INNER]).toStrictEqual(
          SCROLL.THRESHOLD_INNER
        );
      });

      it("Inner threshold is less than input rect", () => {
        expect(threshold.thresholds[SCROLL.ID_INNER].bottom).toBeLessThan(
          SCROLL.RECT.top + SCROLL.RECT.height
        );

        expect(threshold.thresholds[SCROLL.ID_INNER].top).toBeGreaterThan(
          SCROLL.RECT.top
        );

        expect(threshold.thresholds[SCROLL.ID_INNER].left).toBeGreaterThan(
          SCROLL.RECT.left
        );

        expect(threshold.thresholds[SCROLL.ID_INNER].right).toBeLessThan(
          SCROLL.RECT.left + SCROLL.RECT.width
        );
      });

      it("Calculate the threshold correctly", () => {
        expect(SCROLL.RECT.top + SCROLL.RECT.height - pixels.y).toBe(
          threshold.thresholds[SCROLL.ID_INNER].bottom
        );

        expect(SCROLL.RECT.top + pixels.y).toBe(
          threshold.thresholds[SCROLL.ID_INNER].top
        );

        expect(SCROLL.RECT.left + SCROLL.RECT.width - pixels.x).toBe(
          threshold.thresholds[SCROLL.ID_INNER].right
        );

        expect(SCROLL.RECT.left + pixels.x).toBe(
          threshold.thresholds[SCROLL.ID_INNER].left
        );
      });
    });

    describe("Scroll outer threshold", () => {
      it("Add main outer threshold for scroll", () => {
        threshold.setMainThreshold(SCROLL.ID_OUTER, SCROLL.RECT, false);

        expect(threshold).toMatchSnapshot();

        expect(threshold.isOut[SCROLL.ID_OUTER]).toMatchObject(
          DEFAULT_IS_OUT_INDICATORS
        );

        expect(threshold.thresholds[SCROLL.ID_OUTER]).toStrictEqual(
          SCROLL.THRESHOLD_OUTER
        );
      });

      it("Outer threshold is less bigger than input rect", () => {
        expect(threshold.thresholds[SCROLL.ID_OUTER].bottom).toBeGreaterThan(
          SCROLL.RECT.top + SCROLL.RECT.height
        );

        expect(threshold.thresholds[SCROLL.ID_OUTER].top).toBeLessThan(
          SCROLL.RECT.top
        );

        expect(threshold.thresholds[SCROLL.ID_OUTER].left).toBeLessThan(
          SCROLL.RECT.left
        );

        expect(threshold.thresholds[SCROLL.ID_OUTER].right).toBeGreaterThan(
          SCROLL.RECT.left + SCROLL.RECT.width
        );
      });
    });
  });
});
