import { DFlexEventsTypes } from "@dflex/dnd";

type DFlexEventsMap = {
  [K in DFlexEventsTypes]: CustomEvent<DFlexEventPayload>;
};

declare global {
  interface Document {
    addEventListener<key extends keyof DFlexEventsMap>(
      DFlexEventType: key,
      listener: (this: Document, evt: DFlexEventsMap[key]) => void
    ): void;
    removeEventListener<K extends keyof DFlexEventsMap>(
      DFlexEventType: K,
      listener: (this: Document, evt: DFlexEventsMap[K]) => void
    ): void;
  }
}
