/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

let elmBox;
let startingPointX;
let startingPointY;

context("Elements can't be dragged outside the list", () => {
  before(() => {
    cy.visit("http://localhost:3001");
  });

  it("Getting element (#id-9)", () => {
    cy.get("#id-9").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#id-9").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms (#id-9) to the top", () => {
    for (let i = 0; i <= 350; i += 10) {
      cy.get("#id-9").trigger("mousemove", {
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Element inside viewport from the top", () => {
    cy.get("#id-9").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -114)"
    );
  });

  it("Transforms (#id-9) to the bottom", () => {
    for (let i = 350; i >= -900; i -= 10) {
      cy.get("#id-9").trigger("mousemove", {
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Element inside viewport from the bottom", () => {
    cy.get("#id-9").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 496)"
    );
  });

  it("Transforms (#id-9) to the left", () => {
    for (let i = 0; i <= 600; i += 10) {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Element inside viewport from the left", () => {
    cy.get("#id-9").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, -450, 496)"
    );
  });

  it("Transforms (#id-9) to the right", () => {
    for (let i = 600; i >= -900; i -= 10) {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Element inside viewport from the right", () => {
    cy.get("#id-9").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 380, 496)"
    );
  });

  it("Triggers mouseup", () => {
    cy.get("#id-9").trigger("mouseup", {
      force: true,
    });
  });
});
