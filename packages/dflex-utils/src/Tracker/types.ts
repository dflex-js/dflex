export type Prefix = string | number;

export interface ITracker {
  travelID: number;
  newTravel(prefix?: Prefix): string;
}
