// / <reference types="cypress" />
let startingPointX;
let startingPointY;
let elmBox;

context("Actions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001/");
  });

  function movePiece(id, x, y) {
    cy.get(id)
      .trigger("mousedown", { which: 1 })
      .trigger("mousemove", { clientX: x, clientY: y })
      .trigger("mouseup", { force: true });
  }

  it(".click() - click on a DOM element", () => {
    // Main button pressed (usually the left button)

    cy.get("#id-10").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();

      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#id-10")
        .trigger("mousedown", { button: 0 })
        .trigger("mousemove", {
          clientX: 700,
          clientY: startingPointY,
          force: true,
        })
        .trigger("mouseup", { force: true });
    });
  });
});
