/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
let elmBox;
let startingPointX;
let startingPointY;

let steps;

// eslint-disable-next-line no-unused-vars
const waitingTime = 0;

context("Swinging - Confusion starts form bottom/up", () => {
  before(() => {
    cy.visit("http://localhost:3001");
  });

  it("Transforms (container3 |> elm-4) out", () => {
    cy.get("#id-12").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#id-12").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms (container3 |> elm-4) in threshold confusion", () => {
    // steps = elmBox.height + 2 + 180;
    steps = elmBox.height;

    for (let i = 0; i < steps; i += 1) {
      cy.get("#id-12").trigger("mousemove", {
        clientX: startingPointX - i,
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(waitingTime);
    }
  });

  it("Checking the stability of the new positions - 1", () => {
    cy.get("#id-9").should("have.css", "transform", "none");

    cy.get("#id-10").should("have.css", "transform", "none");

    cy.get("#id-11").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );
  });

  it("Continue movement - 1", () => {
    for (let i = steps; i < steps + 45; i += 1) {
      cy.get("#id-12").trigger("mousemove", {
        clientX: startingPointX - i,
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(waitingTime);
    }

    steps += 45;
  });

  it("Checking the stability of the new positions - 2", () => {
    cy.get("#id-9").should("have.css", "transform", "none");

    cy.get("#id-10").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );

    cy.get("#id-11").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );
  });

  it("Continue movement - 2", () => {
    for (let i = steps; i < steps + 45; i += 1) {
      cy.get("#id-12").trigger("mousemove", {
        clientX: startingPointX - i,
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(waitingTime);
    }

    steps += 45;
  });

  it("Checking the stability of the new positions - 3", () => {
    cy.get("#id-9").should("have.css", "transform", "none");

    cy.get("#id-10").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)"
    );

    cy.get("#id-11").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)"
    );
  });

  it("Continue movement - 3", () => {
    for (let i = steps; i < steps + 45; i += 1) {
      cy.get("#id-12").trigger("mousemove", {
        clientX: startingPointX - i,
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(waitingTime);
    }

    steps += 45;
  });

  it("Getting in", () => {
    for (let i = steps; i > 0; i -= 1) {
      cy.get("#id-12").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(waitingTime);
    }
  });

  it("Triggers mouseup", () => {
    cy.get("#id-9").trigger("mouseup", { force: true });
  });

  it("Checking new positions", () => {
    cy.get("#id-9").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );

    cy.get("#id-10").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );

    cy.get("#id-11").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );

    cy.get("#id-12").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -174)"
    );
  });
});
