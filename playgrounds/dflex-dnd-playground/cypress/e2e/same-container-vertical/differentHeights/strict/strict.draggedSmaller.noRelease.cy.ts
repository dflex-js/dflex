context("Moving Elements Strict - Dragged is smaller - No Release", () => {
  let elmBox: DOMRect;
  // let startingPointX;
  let startingPointY: number;

  // let stepsX;
  let stepsY: number;

  let firstElmRect: DOMRect;
  let lastElmRect: DOMRect;

  before(() => {
    cy.visit("http://localhost:3001/todo");
  });

  it("Getting first and last elements rect", () => {
    cy.get("#mtg").then((elm) => {
      firstElmRect = elm[0].getBoundingClientRect();
    });

    cy.get("#gym").then((elm) => {
      lastElmRect = elm[0].getBoundingClientRect();
    });
  });

  it("Getting the first element (mtg)", () => {
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

  it("Transforms element (mtg) - one step", () => {
    stepsY = 155;

    for (let i = 0; i < stepsY; i += 10) {
      cy.get("#mtg").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Siblings have new positions", () => {
    cy.get("#org").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -115.188)",
    );

    cy.get("#proj").should("have.css", "transform", "none");

    cy.get("#gym").should("have.css", "transform", "none");
  });

  it("Transforms element (mtg) - Occupy #proj", () => {
    for (let i = stepsY; i < stepsY + 155; i += 10) {
      cy.get("#mtg").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    stepsY += 155;
  });

  it("Siblings have new positions", () => {
    cy.get("#org").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -115.188)",
    );

    cy.get("#proj").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -115.188)",
    );

    cy.get("#gym").should("have.css", "transform", "none");
  });

  it("Transforms element (mtg) - Occupy #gym", () => {
    for (let i = stepsY; i < stepsY + 155; i += 10) {
      cy.get("#mtg").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    stepsY = 0;
  });

  it("Siblings have new positions", () => {
    cy.get("#org").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -115.188)",
    );

    cy.get("#proj").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -115.188)",
    );

    cy.get("#gym").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -115.188)",
    );
  });

  it("Triggers mouseup", () => {
    cy.get("#mtg").trigger("mouseup", { force: true });
  });

  it("Siblings preserve their positions", () => {
    cy.get("#mtg").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 457.562)",
    );

    cy.get("#org").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -115.188)",
    );

    cy.get("#proj").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -115.188)",
    );

    cy.get("#gym").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -115.188)",
    );
  });

  it("No layout shift happens to the list", () => {
    cy.get("#org").then((elm) => {
      const elmRect1 = elm[0].getBoundingClientRect();

      expect(elmRect1.x).to.equal(firstElmRect.x);
      expect(elmRect1.y).to.equal(firstElmRect.y);
    });

    cy.get("#mtg").then((elm) => {
      const elmRect2 = elm[0].getBoundingClientRect();

      expect(elmRect2.x).to.equal(lastElmRect.x);
      expect(elmRect2.bottom).to.equal(lastElmRect.bottom);
    });
  });
});
