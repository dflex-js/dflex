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

context("Checking restrictions continuity for the first element", () => {
  before(() => {
    cy.visit("http://localhost:3001/restricted");
  });

  context("First element", () => {
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
        // // // // cy.wait(0));
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
        // // // cy.wait(0));
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
        // // // cy.wait(0));
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
        // // // cy.wait(0));
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
      for (let i = 2; i <= 5; i += 1) {
        cy.get(`#item-rest-${i}`).should("have.css", "transform", "none");
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#item-rest-1").trigger("mouseup", { force: true });
    });
  });

  context("Last element", () => {
    it("Getting the last element (#item-rest-5)", () => {
      cy.get("#item-rest-5").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#item-rest-5").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (#item-rest-5) up", () => {
      for (let i = 0; i <= 400; i += 10) {
        cy.get("#item-rest-5").trigger("mousemove", {
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0));
      }

      stepsY = 400;
    });

    it("Triggers mouseup", () => {
      cy.get("#item-rest-5").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      for (let i = 2; i < 5; i += 1) {
        cy.get(`#item-rest-${i}`).should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 71.1875)"
        );
      }
    });

    it("Dragged has new position", () => {
      cy.get(`#item-rest-5`).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -404.75)"
      );
    });

    it("Getting the element 5 (#item-rest-5) again", () => {
      cy.get("#item-rest-5").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#item-rest-5").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (#item-rest-5) down to the end", () => {
      for (let i = 0; i <= 400; i += 10) {
        cy.get("#item-rest-5").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0));
      }

      stepsY = 400;
    });

    it("Triggers mouseup", () => {
      cy.get("#item-rest-5").trigger("mouseup", { force: true });
    });

    it("All elements returns to the initial positions", () => {
      for (let i = 1; i <= 5; i += 1) {
        cy.get(`#item-rest-${i}`).should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)"
        );
      }
    });
  });
});
