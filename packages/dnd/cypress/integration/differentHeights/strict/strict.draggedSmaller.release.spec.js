/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
let elmBox;
// let startingPointX;
let startingPointY;

// let stepsX;
let stepsY;

context(
  "Moving Elements Strict - Dragged is smaller - Releasing the dragged",
  () => {
    before(() => {
      cy.visit("http://localhost:3001/todo");
    });

    it("Getting the first element (mtg)", () => {
      cy.get("#mtg").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#mtg").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (mtg) - one step", () => {
      stepsY = 155;

      for (let i = 0; i < stepsY; i += 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#mtg").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 171.188)"
      );

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#proj").should("have.css", "transform", "none");

      cy.get("#gym").should("have.css", "transform", "none");
    });

    it("Getting the second element (mtg)", () => {
      cy.get("#mtg").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#mtg").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (mtg) - Occupy #proj", () => {
      stepsY = 155;

      for (let i = 0; i < stepsY; i += 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#mtg").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 318.375)"
      );

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#gym").should("have.css", "transform", "none");
    });

    it("Getting the third element (mtg)", () => {
      cy.get("#mtg").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#mtg").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (mtg) - Occupy #gym", () => {
      stepsY = 155;

      for (let i = 0; i < stepsY; i += 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#mtg").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 457.562)"
      );

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );
    });

    it("Getting the last element (mtg)", () => {
      cy.get("#mtg").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#mtg").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (mtg) outside the list", () => {
      stepsY = 60;

      for (let i = 0; i < stepsY; i += 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#mtg").trigger("mouseup", { force: true });
    });

    it("Siblings preserve their positions", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 457.562)"
      );

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );
    });

    it("Getting the last element (mtg)", () => {
      cy.get("#mtg").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#mtg").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (mtg) up to occupy #gym", () => {
      stepsY = 155;

      for (let i = 0; i < stepsY; i += 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#mtg").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 318.375)"
      );

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });

    it("Getting the third element (mtg)", () => {
      cy.get("#mtg").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#mtg").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (mtg) - Occupy #proj", () => {
      stepsY = 155;

      for (let i = 0; i < stepsY; i += 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#mtg").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 171.188)"
      );

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });

    it("Getting the second element (mtg)", () => {
      cy.get("#mtg").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#mtg").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (mtg) back to first", () => {
      stepsY = 155;

      for (let i = 0; i < stepsY; i += 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#mtg").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });

    it("Getting the the element (mtg)", () => {
      cy.get("#mtg").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // eslint-disable-next-line no-unused-vars
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#mtg").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (mtg) outside the list", () => {
      stepsY = 75;

      for (let i = 0; i < stepsY; i += 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Siblings are lifted up", () => {
      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );
    });

    it("Triggers mouseup", () => {
      cy.get("#mtg").trigger("mouseup", { force: true });
    });

    it("Siblings go back to old positions", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });
  }
);
