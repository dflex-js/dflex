/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

let elmBox;
let startingPointX;
// let startingPointY;

// const stepsX = 0;
// const stepsY = 0;

context(
  "Testing not all elements transformed when dragging still inside viewport",
  () => {
    before(() => {
      cy.visit("http://localhost:3001/extended");
    });

    it("Getting element (#1)", { scrollBehavior: false }, () => {
      cy.get("#1-extended").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        startingPointX = elmBox.x + elmBox.width / 2;
        // startingPointY = elmBox.y + elmBox.height / 2;
        cy.get("#1-extended").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms (#1-extended) to the right", () => {
      for (let i = 0; i <= 200; i += 10) {
        cy.get("#1-extended").trigger("mousemove", {
          clientX: startingPointX + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#1-extended").trigger("mouseup", {
        force: true,
      });
    });

    it("Invisible elements not effected", () => {
      for (let i = 13; i < 100; i += 1) {
        cy.get(`#${i}-extended`).should("have.css", "transform", "none");
      }
    });
  }
);