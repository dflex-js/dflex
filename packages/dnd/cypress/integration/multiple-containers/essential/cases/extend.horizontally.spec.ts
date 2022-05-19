context("Extend the insertion area horizontally", () => {
  before(() => {
    cy.visit("http://localhost:3001/migration");
  });

  let elmBox: DOMRect;
  let startingPointX: number;
  let startingPointY: number;

  let stepsX = 0;
  let stepsY = 0;

  it("Getting the first element from container-1", () => {
    cy.get("#c1-1").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#c1-1").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (#c1-1) - bellow container-2", () => {
    stepsY = 315;
    for (let i = 0; i < stepsY; i += 10) {
      cy.get("#c1-1").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }

    stepsX = 231;
    for (let i = 0; i < stepsX; i += 10) {
      cy.get("#c1-1").trigger("mousemove", {
        clientX: startingPointX + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
  });

  it("Triggers mouseup event", () => {
    cy.get("#c1-1").trigger("mouseup", { force: true });
  });

  it("Siblings in the destination (c2) are untransformed", () => {
    cy.get("#c2-1").should("have.css", "transform", "none");
    cy.get("#c2-2").should("have.css", "transform", "none");
    cy.get("#c2-3").should("have.css", "transform", "none");
    cy.get("#c2-4").should("have.css", "transform", "none");
    cy.get("#c2-4").should("have.css", "transform", "none");
  });

  it("Dragged is positioned correctly in the bottom of (c2)", () => {
    cy.get("#c1-1").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 226, 310)"
    );
  });
});
