context("Strict splitting container horizontally", () => {
  let elmBox: DOMRect;
  let startingPointX: number;
  // let startingPointY: number;

  let stepsX = 0;
  // const stepsY = 0;

  before(() => {
    cy.visit("http://localhost:3001/migration");
  });

  it("Getting the second element from container-3", () => {
    cy.get("#c3-2").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      startingPointX = elmBox.x + elmBox.width / 2;
      // startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#c3-2").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (#c3-2) - outside the origin container(3) inside container(2)", () => {
    stepsX = 230;
    for (let i = 0; i < stepsX; i += 10) {
      cy.get("#c3-2").trigger("mousemove", {
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

  it("Siblings in origin container have new positions", () => {
    cy.get("#c3-1").should("have.css", "transform", "none");

    cy.get("#c3-2").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, -226, 12)"
    );
  });

  it("Siblings in destination container have new positions", () => {
    cy.get("#c2-1").should("have.css", "transform", "none");

    cy.get("#c2-2").should("have.css", "transform", "none");

    cy.get("#c2-3").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 112)"
    );

    cy.get("#c2-4").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 112)"
    );

    cy.get("#c2-5").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 112)"
    );
  });
});
