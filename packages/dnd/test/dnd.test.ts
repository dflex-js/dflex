import { store, DnD } from "../src/index";

import { elm1, elm2, elm3, elm4 } from "./utils";

describe.skip("Checks Store Instance", () => {
  beforeAll(() => {
    store.register(elm1);
    store.register(elm2);
    store.register(elm3);
    store.register(elm4);
  });

  it("Dragging first element to the end of the list", () => {
    const dnd = new DnD(elm1.id, { x: 551, y: 122 });
    for (let i = 122; i <= 286; i += 1) {
      dnd.dragAt(551, i);
    }

    dnd.endDragging();
  });

  it("Checks offset of element-1", () => {
    const offsetElm1 = store.registry[elm1.id].offset;
    expect(offsetElm1).toStrictEqual({
      height: 50,
      left: 450,
      top: 288,
      width: 170,
    });
  });

  it("Checks offset of element-2", () => {
    const offsetElm2 = store.registry[elm2.id].offset;
    expect(offsetElm2).toStrictEqual({
      height: 50,
      left: 450,
      top: 114,
      width: 170,
    });
  });

  it("Checks offset of element-3", () => {
    const offsetElm3 = store.registry[elm3.id].offset;
    expect(offsetElm3).toStrictEqual({
      height: 50,
      left: 450,
      top: 172,
      width: 170,
    });
  });

  it("Checks offset of element-4", () => {
    const offsetElm4 = store.registry[elm4.id].offset;
    expect(offsetElm4).toStrictEqual({
      height: 50,
      left: 450,
      top: 230,
      width: 170,
    });
  });

  it("Checks transition of element-1", () => {
    const transElm1 = store.getELmTranslateById(elm1.id);
    expect(transElm1).toStrictEqual({ translateX: 0, translateY: 174 });
  });

  it("Checks transition of element-2", () => {
    const transElm2 = store.getELmTranslateById(elm2.id);
    expect(transElm2).toStrictEqual({ translateX: 0, translateY: -58 });
  });

  it("Checks transition of element-3", () => {
    const transElm3 = store.getELmTranslateById(elm3.id);
    expect(transElm3).toStrictEqual({ translateX: 0, translateY: -58 });
  });

  it("Checks transition of element-4", () => {
    const transElm4 = store.getELmTranslateById(elm4.id);
    expect(transElm4).toStrictEqual({ translateX: 0, translateY: -58 });
  });

  it("Checks the order of siblings", () => {
    const siblings = store.getElmSiblingsById(elm1.id);

    expect(siblings).toStrictEqual(["id-2", "id-3", "id-4", "id-1"]);
  });

  it("Dragging first element to the top of the list", () => {
    const dnd = new DnD(elm1.id, { x: 551, y: 286 });

    for (let i = 286; i >= 122; i -= 1) {
      dnd.dragAt(551, i);
    }

    dnd.endDragging();
  });

  it("Restore offset of element-1", () => {
    const offsetElm1 = store.registry[elm1.id].offset;
    expect(offsetElm1).toStrictEqual(elm1.ref.getBoundingClientRect());
  });

  it("Restore offset of element-4", () => {
    const offsetElm4 = store.registry[elm4.id].offset;
    expect(offsetElm4).toStrictEqual(elm4.ref.getBoundingClientRect());
  });

  it("Restore offset of element-3", () => {
    const offsetElm3 = store.registry[elm3.id].offset;
    expect(offsetElm3).toStrictEqual(elm3.ref.getBoundingClientRect());
  });

  it("Restore offset of element-4", () => {
    const offsetElm4 = store.registry[elm4.id].offset;
    expect(offsetElm4).toStrictEqual(elm4.ref.getBoundingClientRect());
  });

  it("Makes sure the order of siblings is back in correct order", () => {
    const siblings = store.getElmSiblingsById(elm1.id);
    expect(siblings).toStrictEqual(["id-1", "id-2", "id-3", "id-4"]);
  });
});
