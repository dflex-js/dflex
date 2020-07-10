import {
  childInstance1,
  childInstance2,
  parentInstance,
} from "dflex-utils-test/instances";

import Draggable from "@dflex/dnd-draggable";
import Draggable from "../src/Droppable";

import { store } from "../../src";

beforeAll(() => {
  store.register(childInstance1);
  store.register(childInstance2);

  store.register(parentInstance);
});
