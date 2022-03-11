import { ThresholdCoordinate, IndicatorsInterface } from "./types";

class ThresholdIndicators implements IndicatorsInterface {
  $!: ThresholdCoordinate;

  isInTop!: boolean;

  isInBottom!: boolean;

  isInLeft!: boolean;

  isInRight!: boolean;

  constructor($: ThresholdCoordinate) {
    this.set($);
  }

  set($: ThresholdCoordinate) {
    this.$ = $;

    this.isInTop = false;
    this.isInBottom = false;
    this.isInLeft = false;
    this.isInRight = false;
  }

  isInsideTop(y: number) {
    const { top } = this.$;

    this.isInTop = y >= top.min;

    return this.isInTop;
  }

  isInsideBottom(y: number) {
    const { top } = this.$;

    this.isInBottom = y <= top.max;

    return this.isInBottom;
  }

  isInsideYThreshold(y: number) {
    return this.isInsideTop(y) || this.isInsideBottom(y);
  }

  isInsideLeft(x: number) {
    const { left } = this.$;

    this.isInLeft = x >= left.min;

    return this.isInLeft;
  }

  isInsideRight(x: number) {
    const { left } = this.$;

    this.isInRight = x <= left.max;

    return this.isInRight;
  }

  isInsideXThreshold(x: number) {
    return this.isInsideLeft(x) || this.isInsideRight(x);
  }

  isInsideThreshold(x: number, y: number) {
    return this.isInsideXThreshold(x) && this.isInsideYThreshold(y);
  }
}

export default ThresholdIndicators;
