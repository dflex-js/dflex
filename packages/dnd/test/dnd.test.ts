import { store, DnD } from "../src/index";

import { elm1, elm2, elm3, elm4 } from "./utils";

describe("Checks Store Instance", () => {
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

  it("Checks offset of elements", () => {
    const offsetElm1 = store.getELmOffsetById(elm1.id);
    const offsetElm2 = store.getELmOffsetById(elm2.id);
    const offsetElm3 = store.getELmOffsetById(elm3.id);
    const offsetElm4 = store.getELmOffsetById(elm4.id);

    expect(offsetElm1).toMatchSnapshot();
    expect(offsetElm2).toMatchSnapshot();
    expect(offsetElm3).toMatchSnapshot();
    expect(offsetElm4).toMatchSnapshot();
  });

  it("Checks transition of elements", () => {
    const transElm1 = store.getELmTranslateById(elm1.id);
    const transElm2 = store.getELmTranslateById(elm2.id);
    const transElm3 = store.getELmTranslateById(elm3.id);
    const transElm4 = store.getELmTranslateById(elm4.id);

    expect(transElm1).toMatchSnapshot();
    expect(transElm2).toMatchSnapshot();
    expect(transElm3).toMatchSnapshot();
    expect(transElm4).toMatchSnapshot();
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

  it("Restore offset of elements", () => {
    const offsetElm1 = store.getELmOffsetById(elm1.id);
    const offsetElm2 = store.getELmOffsetById(elm2.id);
    const offsetElm3 = store.getELmOffsetById(elm3.id);
    const offsetElm4 = store.getELmOffsetById(elm4.id);

    expect(offsetElm1).toMatchSnapshot();
    expect(offsetElm2).toMatchSnapshot();
    expect(offsetElm3).toMatchSnapshot();
    expect(offsetElm4).toMatchSnapshot();
  });

  it("Restore transition of elements", () => {
    const transElm1 = store.getELmTranslateById(elm1.id);
    const transElm2 = store.getELmTranslateById(elm2.id);
    const transElm3 = store.getELmTranslateById(elm3.id);
    const transElm4 = store.getELmTranslateById(elm4.id);

    expect(transElm1).toMatchSnapshot();
    expect(transElm2).toMatchSnapshot();
    expect(transElm3).toMatchSnapshot();
    expect(transElm4).toMatchSnapshot();
  });

  it("Makes sure the order of siblings is back in correct order", () => {
    const siblings = store.getElmSiblingsById(elm1.id);

    expect(siblings).toStrictEqual(["id-1", "id-2", "id-3", "id-4"]);
  });
});
