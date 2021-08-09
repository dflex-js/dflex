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
let stepsY = 0;

context("Working with visibility, changing positions and continuity", () => {
  before(() => {
    cy.visit("http://localhost:3001/extended");
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

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // // cy.wait(0);
    }

    stepsY = 72;
    for (let i = 0; i < stepsY; i += 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // // cy.wait(0);
    }
  });

  it("Insert element (1) inside the list", () => {
    for (let i = stepsX; i > 0; i -= 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
    stepsX = 0;
  });

  it("Splitting the list after 2 and 3", () => {
    cy.get(`#2-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -59.1875)"
    );

    cy.get(`#3-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -59.1875)"
    );
  });

  it("The Splitting changing the index dataset", () => {
    cy.get(`#2-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`0`);
    });

    cy.get(`#3-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`1`);
    });

    cy.get(`#1-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`2`);
    });
  });

  it("Triggers mouseup", () => {
    cy.get("#1-extended").trigger("mouseup", { force: true });
  });

  it("Checking list new positions", () => {
    cy.get(`#1-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 118.375)"
    );

    cy.get(`#2-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -59.1875)"
    );

    cy.get(`#3-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -59.1875)"
    );
  });

  it("List has new order", () => {
    cy.get(`#2-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`0`);
    });

    cy.get(`#3-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`1`);
    });

    cy.get(`#1-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`2`);
    });
  });

  it("Non-visible elements don't have any transformation", () => {
    for (let i = 14; i < 100; i += 10) {
      cy.get(`#${i}-extended`).should("have.css", "transform", "none");
    }
  });

  it("Getting the third element (1-extended) - Chekiang just clicking", () => {
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

  it("Triggers mouseup", () => {
    cy.get("#1-extended").trigger("mouseup", { force: true });
  });

  it("Nothing change in the list by just clicking", () => {
    cy.get(`#1-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 118.375)"
    );

    cy.get(`#2-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -59.1875)"
    );

    cy.get(`#3-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -59.1875)"
    );

    cy.get(`#2-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`0`);
    });

    cy.get(`#3-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`1`);
    });

    cy.get(`#1-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`2`);
    });
  });

  it("Getting the third element (1-extended) - Chekiang continuity", () => {
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

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    stepsY = 112;
    for (let i = 0; i < stepsY; i += 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Insert element (1) inside the list", () => {
    for (let i = stepsX; i > 0; i -= 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
    stepsX = 0;
  });

  it("Splitting the list at 6", () => {
    for (let i = 2; i < 6; i += 10) {
      cy.get(`#${i}-extended`).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -59.1875)"
      );
    }
  });

  it("Transom element down", () => {
    stepsY = 522;

    for (let i = 112; i < stepsY; i += 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    stepsX = 0;
  });

  it("Triggers mouseup", () => {
    cy.get("#1-extended").trigger("mouseup", { force: true });
  });

  it("Siblings order dataset is updated now", () => {
    for (let i = 2; i < 13; i += 10) {
      cy.get(`#${i}-extended`).then((elm) => {
        const { index } = elm[0].dataset;
        expect(index).to.be.eq(`${i - 2}`);
      });
    }
    cy.get(`#1-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`11`);
    });
  });

  it("Siblings have new positions", () => {
    for (let i = 2; i < 13; i += 10) {
      cy.get(`#${i}-extended`).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -59.1875)"
      );
    }

    cy.get(`#1-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 651.062)"
    );
  });

  it("Non-visible elements don't have any transformation", () => {
    for (let i = 16; i < 100; i += 10) {
      cy.get(`#${i}-extended`).should("have.css", "transform", "none");
    }
  });
});
