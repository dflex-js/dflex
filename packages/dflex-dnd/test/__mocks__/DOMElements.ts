function elm1Offset() {
  return { height: 50, left: 450, top: 114, width: 170 };
}

function elm2Offset() {
  return {
    height: 50,
    left: 450,
    top: 172,
    width: 170,
  };
}

function elm3Offset() {
  return {
    height: 50,
    left: 450,
    top: 230,
    width: 170,
  };
}

function elm4Offset() {
  return { height: 50, left: 450, top: 288, width: 170 };
}

const ref1 = document.createElement("div");

// @ts-expect-error
ref1.getBoundingClientRect = elm1Offset;
const elm1 = {
  id: "id-1",
  depth: 0,
  ref: ref1,
};

const ref2 = document.createElement("div");
// @ts-expect-error
ref2.getBoundingClientRect = elm2Offset;
const elm2 = {
  id: "id-2",
  depth: 0,
  ref: ref2,
};

const ref3 = document.createElement("div");
// @ts-expect-error
ref3.getBoundingClientRect = elm3Offset;
const elm3 = {
  id: "id-3",
  depth: 0,
  ref: ref3,
};

const ref4 = document.createElement("div");
// @ts-expect-error
ref4.getBoundingClientRect = elm4Offset;
const elm4 = {
  id: "id-4",
  depth: 0,
  ref: ref4,
};

export { elm1, elm2, elm3, elm4 };
