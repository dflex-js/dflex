context(
  "Transitioning the last element into the bottom of a bigger container horizontally",
  () => {
    let elmBox: DOMRect;
    let startingPointX: number;
    let startingPointY: number;

    let stepsX = 0;

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

    it("Triggers mouseup event", () => {
      cy.get("#c3-2").trigger("mouseup", { force: true });
    });

    it("Transforms element (#c3-2) - back to the origin", () => {
      cy.get("#c3-2").trigger("mousedown", {
        button: 0,
      });

      for (let i = stepsX; i >= 0; i -= 10) {
        cy.get("#c3-2").trigger("mousemove", {
          clientX: startingPointX - i,
          clientY: startingPointY,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(0);
      }
    });

    it("Triggers mouseup event", () => {
      cy.get("#c3-2").trigger("mouseup", { force: true });
    });

    it("Siblings from the destination are back in positions", () => {
      cy.get("#c2-1").should("have.css", "transform", "none");

      cy.get("#c2-2").should("have.css", "transform", "none");

      cy.get("#c2-3").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );

      cy.get("#c2-4").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );

      cy.get("#c2-5").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );
    });

    it("Siblings in origin are back in positions", () => {
      cy.get("#c3-1").should("have.css", "transform", "none");

      cy.get("#c3-2").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );
    });
  },
);
