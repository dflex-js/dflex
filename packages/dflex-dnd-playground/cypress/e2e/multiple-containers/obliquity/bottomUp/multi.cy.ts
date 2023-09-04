context("Split multiple containers from bottom up", () => {
  before(() => {
    cy.visit("http://localhost:3001/migration");
  });

  let elmBox: DOMRect;
  let startingPointX: number;
  let startingPointY: number;

  let stepsX = 0;
  let stepsY = 0;

  it("Getting the first element from container-3", () => {
    cy.get("#c3-2").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#c3-2").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (#c3-2) into containers-1", () => {
    stepsY = 280;
    for (let i = 0; i < stepsY; i += 10) {
      cy.get("#c3-2").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }

    stepsX = 420;
    for (let i = 0; i < stepsX; i += 10) {
      cy.get("#c3-2").trigger("mousemove", {
        clientY: startingPointY + stepsY - i,
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
  });

  it("Triggers mouseup event", () => {
    cy.get("#c3-2").trigger("mouseup", { force: true });
  });

  it("Siblings in the origin have the right positions", () => {
    cy.get("#c3-1").should("have.css", "transform", "none");
  });

  it("Siblings in the c2 container have the right positions", () => {
    cy.get("#c2-1").should("have.css", "transform", "none");

    cy.get("#c2-2").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");

    cy.get("#c2-3").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");

    cy.get("#c2-4").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");

    cy.get("#c2-5").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
  });

  it("Siblings in the destination have the right positions", () => {
    cy.get("#c1-1").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 112)",
    );
  });

  it("Dragged is correctly settled", () => {
    cy.get("#c3-2").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, -452, -112)",
    );
  });
});
