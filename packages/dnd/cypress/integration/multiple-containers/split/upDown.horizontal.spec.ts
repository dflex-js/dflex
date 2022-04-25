context("Splitting container horizontally and transform up/down", () => {
  let elmBox: DOMRect;
  let startingPointX: number;
  let startingPointY: number;

  let stepsX = 0;
  let stepsY = 0;

  before(() => {
    cy.visit("http://localhost:3001/migration");
  });

  it("Getting the second element from container-3", () => {
    cy.get("#c3-2").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

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

  it("Transforms element (#c3-2) - outside the container-2", () => {
    stepsY = 190;
    for (let i = 0; i < stepsY; i += 10) {
      cy.get("#c3-2").trigger("mousemove", {
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
  });

  it("Siblings in container-2 are lifted up", () => {
    cy.get("#c2-1").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");

    cy.get("#c2-2").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");

    cy.get("#c2-3").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");

    cy.get("#c2-4").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");

    cy.get("#c2-5").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
  });

  it("Transforms element (#c3-2) - back inside the container-2", () => {
    for (let i = stepsY; i >= -250; i -= 10) {
      cy.get("#c3-2").trigger("mousemove", {
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
  });

  it("Triggers mouseup event", () => {
    cy.get("#c3-2").trigger("mouseup", { force: true });
  });
});
