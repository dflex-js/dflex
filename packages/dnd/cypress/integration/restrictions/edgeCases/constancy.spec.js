let elmBox;
let startingPointX;
let startingPointY;

let stepsX = 0;
let stepsY = 0;

context("Checking restrictions constancy", () => {
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
      // cy.wait(0);
    }

    stepsY += 2;
  });

  it("Transforms element (#item-rest-1) to restricted up", () => {
    for (let i = stepsY; i < stepsY + 100; i += 1) {
      cy.get("#item-rest-1").trigger("mousemove", {
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
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
    stepsX = 100;

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

  it("Dragged is inside", () => {
    cy.get("#item-rest-1").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)"
    );
  });

  it("Transforms element (#item-rest-1) to restricted right", () => {
    stepsX = 200;

    for (let i = stepsX; i > 0; i -= 1) {
      cy.get("#item-rest-1").trigger("mousemove", {
        clientX: startingPointX + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    stepsX = 0;
  });

  it("Dragged is inside", () => {
    cy.get("#item-rest-1").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)"
    );
  });

  it("Restricted movements don't trigger any transformation", () => {
    cy.get("#item-rest-2").should("have.css", "transform", "none");
    cy.get("#item-rest-3").should("have.css", "transform", "none");
    cy.get("#item-rest-4").should("have.css", "transform", "none");
    cy.get("#item-rest-5").should("have.css", "transform", "none");
  });
});
