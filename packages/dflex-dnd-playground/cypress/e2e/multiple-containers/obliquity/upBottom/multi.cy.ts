context("Split multiple containers form up bottom", () => {
  before(() => {
    cy.visit("http://localhost:3001/migration");
  });

  let elmBox: DOMRect;
  let startingPointX: number;
  let startingPointY: number;

  // const stepsX = 0;
  let stepsY = 0;

  it("Getting the first element from container-3", () => {
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

  it("Transforms element (#c1-1) into containers-3", () => {
    stepsY = 120;
    for (let i = 0; i < stepsY; i += 10) {
      cy.get("#c1-1").trigger("mousemove", {
        clientY: startingPointY + i,
        clientX: startingPointX + i * 4,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
  });

  it("Triggers mouseup event", () => {
    cy.get("#c1-1").trigger("mouseup", { force: true });
  });

  it("Siblings in container-2 have the correct position", () => {
    cy.get("#c2-1").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.get("#c2-2").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.get("#c2-3").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.get("#c2-4").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    cy.get("#c2-5").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
  });

  it("Siblings in the destination have the correct position", () => {
    cy.get("#c3-1").should("have.css", "transform", "none");
    cy.get("#c3-2").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 92)",
    );
  });

  it("Dragged is settled correctly", () => {
    cy.get("#c1-1").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 452, 112)",
    );
  });
});
