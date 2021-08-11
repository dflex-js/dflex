/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
let elmBox;
let startingPointX;
let startingPointY;

let stepsX = 0;
let stepsY = 0;

context("Checking restrictions constancy for the first element", () => {
  before(() => {
    cy.visit("http://localhost:3001/restricted");
  });

  it("Getting the first element (#item-rest-1)", () => {
    cy.get("#item-rest-1").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#item-rest-1").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (#item-rest-1) before threshold", () => {
    for (let i = stepsY; i < stepsY + 2; i += 1) {
      cy.get("#item-rest-1").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // // // cy.wait(0);
    }

    stepsY += 2;
  });

  it("Transforms element (#item-rest-1) to restricted up", () => {
    for (let i = stepsY; i < stepsY + 100; i += 10) {
      cy.get("#item-rest-1").trigger("mousemove", {
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // // cy.wait(0);
    }

    stepsY += 100;
  });

  it("Dragged is inside", () => {
    cy.get("#item-rest-1").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)"
    );
  });

  it("Transforms element (#item-rest-1) to restricted left", () => {
    for (let i = stepsX; i < stepsX + 210; i += 10) {
      cy.get("#item-rest-1").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // // cy.wait(0);
    }
    stepsX += 210;
  });

  it("Dragged is inside", () => {
    cy.get("#item-rest-1").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)"
    );
  });

  it("Transforms element (#item-rest-1) to restricted right", () => {
    for (let i = stepsX; i > -370; i -= 10) {
      cy.get("#item-rest-1").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // // cy.wait(0);
    }

    stepsX += -370;
  });

  it("Dragged is inside", () => {
    cy.get("#item-rest-1").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)"
    );
  });

  it("Transforms element (#item-rest-1) to origin", () => {
    cy.get("#item-rest-1").trigger("mousemove", {
      clientX: startingPointX,
      clientY: startingPointY,
      force: true,
    });
  });

  it("Restricted movements don't trigger any transformation", () => {
    cy.get("#item-rest-2").should("have.css", "transform", "none");
    cy.get("#item-rest-3").should("have.css", "transform", "none");
    cy.get("#item-rest-4").should("have.css", "transform", "none");
    cy.get("#item-rest-5").should("have.css", "transform", "none");
  });

  it("Triggers mouseup", () => {
    cy.get("#item-rest-1").trigger("mouseup", { force: true });
  });
});
