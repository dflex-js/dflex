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

context(
  "Moving A Complete Restricted Element - Dragged is not released - Bottom/right/left",
  () => {
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

    it("Transforms element (#item-rest-1)", () => {
      for (let i = stepsY; i < stepsY + 88; i += 1) {
        cy.get("#item-rest-1").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // // cy.wait(0);
      }

      stepsY += 88;
    });

    it("Effected siblings are transformed", () => {
      cy.get("#item-rest-2").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );
    });

    it("Transforms element (#item-rest-1)", () => {
      for (let i = stepsY; i < stepsY + 58; i += 1) {
        cy.get("#item-rest-1").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }

      stepsY += 58;
    });

    it("Effected siblings are transformed", () => {
      cy.get("#item-rest-2").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );
    });

    it("non-effected siblings are not transformed", () => {
      cy.get("#item-rest-3").should("have.css", "transform", "none");
      cy.get("#item-rest-4").should("have.css", "transform", "none");
      cy.get("#item-rest-5").should("have.css", "transform", "none");
    });

    it("Transforms element (#item-rest-1)", () => {
      for (let i = stepsY; i < stepsY + 122; i += 1) {
        cy.get("#item-rest-1").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // // cy.wait(0);
      }

      stepsY += 122;
    });

    it("Effected siblings are transformed", () => {
      cy.get("#item-rest-2").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );

      cy.get("#item-rest-3").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );

      cy.get("#item-rest-4").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );
    });

    it("non-effected siblings are not transformed", () => {
      cy.get("#item-rest-5").should("have.css", "transform", "none");
    });

    it("Transforms element (#item-rest-1)", () => {
      for (let i = stepsY; i < stepsY + 79; i += 1) {
        cy.get("#item-rest-1").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }

      stepsY += 79;
    });

    it("Effected siblings are transformed", () => {
      cy.get("#item-rest-2").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );

      cy.get("#item-rest-3").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );

      cy.get("#item-rest-4").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );

      cy.get("#item-rest-5").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );
    });

    it("Transforms element (#item-rest-1) to restricted bottom", () => {
      for (let i = stepsY; i < stepsY + 52; i += 1) {
        cy.get("#item-rest-1").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }

      stepsY += 52;
    });

    it("Dragged still inside the definition area", () => {
      cy.get("#item-rest-1").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 376.75)"
      );
    });

    it("Transforms element (#item-rest-1) to restricted right", () => {
      for (let i = stepsX; i < stepsX + 52; i += 1) {
        cy.get("#item-rest-1").trigger("mousemove", {
          clientX: startingPointX + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }

      stepsX += 52;
    });

    it("Dragged still inside the definition area", () => {
      cy.get("#item-rest-1").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 376.75)"
      );
    });

    it("Transforms element (#item-rest-1) to restricted left", () => {
      for (let i = stepsX; i > 0; i -= 1) {
        cy.get("#item-rest-1").trigger("mousemove", {
          clientX: startingPointX - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }

      stepsX = 0;
    });

    it("Dragged still inside the definition area", () => {
      cy.get("#item-rest-1").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 376.75)"
      );
    });

    it("Triggers mouseup", () => {
      cy.get("#item-rest-1").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#item-rest-2").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );

      cy.get("#item-rest-3").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );

      cy.get("#item-rest-4").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );

      cy.get("#item-rest-5").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -99.1875)"
      );
    });
  }
);
