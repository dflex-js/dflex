context("Passing containers while transforming", () => {
  let elmBox: DOMRect;
  let startingPointX: number;
  let startingPointY: number;

  let stepsX = 0;
  let stepsY = 0;

  before(() => {
    cy.visit("http://localhost:3001/migration");
  });

  it("Getting the first element from container-1", () => {
    cy.get("#c3-1").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#c3-1").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (#c3-1) - outside the list above container-2", () => {
    stepsY = 90;
    for (let i = 0; i < stepsY; i += 10) {
      cy.get("#c3-1").trigger("mousemove", {
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }

    stepsX = 470;
    for (let i = 0; i < stepsX; i += 10) {
      cy.get("#c3-1").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
  });

  it("Transforms element (#c3-1) - inside container-2", () => {
    // stepsY = 110;
    for (let i = stepsY; i >= 0; i -= 10) {
      cy.get("#c3-1").trigger("mousemove", {
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
  });

  it("Triggers mouseup event", () => {
    cy.get("#c3-1").trigger("mouseup", { force: true });
  });

  it("Siblings from the targets are having new positions", () => {
    cy.get("#c3-2").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -112)"
    );
  });

  it("Siblings in origin takes new positions", () => {
    cy.get("#c1-1").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 106)"
    );
  });

  it("Dragged has fully transformed", () => {
    cy.get("#c3-1").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, -452, 0)"
    );
  });
});
