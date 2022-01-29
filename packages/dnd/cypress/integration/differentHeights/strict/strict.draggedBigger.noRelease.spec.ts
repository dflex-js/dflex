context("Moving Elements Strict - Dragged is bigger - No Release", () => {
  let elmBox: DOMRect;
  // let startingPointX;
  let startingPointY: number;

  // let stepsX;
  let stepsY: number;

  before(() => {
    cy.visit("http://localhost:3001/todo");
  });

  it("Getting the second element (org)", () => {
    cy.get("#org").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#org").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (org) - one step", () => {
    stepsY = 155;

    for (let i = 0; i < stepsY; i += 10) {
      cy.get("#org").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Siblings have new positions", () => {
    cy.get("#mtg").should("have.css", "transform", "none");

    cy.get("#proj").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -171.188)"
    );

    cy.get("#gym").should("have.css", "transform", "none");
  });

  it("Transforms element (org) - Occupy #gym", () => {
    for (let i = stepsY; i < stepsY + 155; i += 10) {
      cy.get("#org").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    stepsY += 155;
  });

  it("Siblings have new positions", () => {
    cy.get("#mtg").should("have.css", "transform", "none");

    cy.get("#proj").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -171.188)"
    );

    cy.get("#gym").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -171.188)"
    );
  });

  it("Triggers mouseup", () => {
    cy.get("#org").trigger("mouseup", { force: true });
  });

  it("Siblings have new positions", () => {
    cy.get("#mtg").should("have.css", "transform", "none");

    cy.get("#org").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 286.375)"
    );

    cy.get("#proj").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -171.188)"
    );

    cy.get("#gym").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -171.188)"
    );
  });

  it("Getting the last element (org)", () => {
    cy.get("#org").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      // startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#org").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (org) up to occupy gym", () => {
    stepsY = 155;

    for (let i = 0; i < stepsY; i += 10) {
      cy.get("#org").trigger("mousemove", {
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Siblings have new positions", () => {
    cy.get("#mtg").should("have.css", "transform", "none");

    cy.get("#proj").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -171.188)"
    );

    cy.get("#gym").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
  });

  it("Transforms element (org) up to occupy #prog", () => {
    for (let i = stepsY; i < stepsY + 155; i += 10) {
      cy.get("#org").trigger("mousemove", {
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    stepsY += 155;
  });

  it("Siblings have new positions", () => {
    cy.get("#mtg").should("have.css", "transform", "none");

    cy.get("#proj").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");

    cy.get("#gym").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
  });

  it("Transforms element (org) up to occupy the first position", () => {
    for (let i = stepsY; i < stepsY + 120; i += 10) {
      cy.get("#org").trigger("mousemove", {
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Triggers mouseup", () => {
    cy.get("#org").trigger("mouseup", { force: true });
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

    cy.get("#proj").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");

    cy.get("#gym").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
  });
});
