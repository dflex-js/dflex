/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

let elmBox;
let startingPointX;
// eslint-disable-next-line no-unused-vars
let startingPointY;

let stepsX = 0;

context("Visible elements have transformation", () => {
  before(() => {
    cy.visit("http://localhost:3001/extended");
  });

  it("Checking first 10 elements all have index dataset", () => {
    for (let i = 1; i < 10; i += 1) {
      cy.get(`#${i}-extended`).then((elm) => {
        const { index } = elm[0].dataset;

        expect(index).to.be.eq(`${i - 1}`);
      });
    }
  });

  it("Getting the first element (1)", () => {
    cy.get("#1-extended").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#1-extended").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (1) - outside the list", () => {
    stepsX = 240;

    for (let i = 0; i < stepsX; i += 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
    }
  });

  it("Visible Siblings are lifted up", () => {
    for (let i = 2; i < 14; i += 1) {
      cy.get(`#${i}-extended`).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -59.1875)"
      );
    }
  });

  it("Triggers mouseup", () => {
    cy.get("#1-extended").trigger("mouseup", { force: true });
  });

  it("Siblings return to the old positions", () => {
    for (let i = 1; i < 14; i += 1) {
      cy.get(`#${i}-extended`).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    }
  });

  it("Non-visible elements don't have any transformation", () => {
    for (let i = 14; i < 100; i += 1) {
      cy.get(`#${i}-extended`).should("have.css", "transform", "none");
    }
  });

  // it("Scroll to element 21", () => {
  //   cy.scrollTo(0, 600); // Scroll the window 500px down
  // });

  it("Rest of non-visible and not effected elements have no transformation", () => {
    for (let i = 24; i < 100; i += 1) {
      cy.get(`#${i}-extended`).should("have.css", "transform", "none");
    }
  });

  it("Checking dataset index stays the same", () => {
    for (let i = 1; i < 10; i += 1) {
      cy.get(`#${i}-extended`).then((elm) => {
        const { index } = elm[0].dataset;

        expect(index).to.be.eq(`${i - 1}`);
      });
    }
  });
});
