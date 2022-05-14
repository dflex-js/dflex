context(
  "Transitioning the last element into the bottom of another container horizontally",
  () => {
    let elmBox: DOMRect;
    let startingPointX: number;
    let startingPointY: number;

    let stepsX = 0;
    let stepsY = 0;

    before(() => {
      cy.visit("http://localhost:3001/migration");
    });

    it("Getting the second element from container-3", () => {
      cy.get("#c1-1").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#c1-1").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (#c1-1) - to the bottom of container(2)", () => {
      stepsY = 310;
      for (let i = 0; i <= stepsY; i += 10) {
        cy.get("#c1-1").trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }

      stepsX = 180;
      for (let i = 0; i < stepsY; i += 10) {
        cy.get("#c1-1").trigger("mousemove", {
          clientX: startingPointX + stepsX,
          clientY: startingPointY + stepsY,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup event", () => {
      cy.get("#c1-1").trigger("mouseup", { force: true });
    });

    it("Siblings in the target are in positions", () => {
      cy.get("#c2-1").should("have.css", "transform", "none");

      cy.get("#c2-2").should("have.css", "transform", "none");

      cy.get("#c2-3").should("have.css", "transform", "none");

      cy.get("#c2-4").should("have.css", "transform", "none");

      cy.get("#c2-5").should("have.css", "transform", "none");
    });

    it("Dragged has new position", () => {
      cy.get("#c1-1").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 226, 304)"
      );
    });

    it("Transforms element (#c1-1) - to the bottom of container(2)", () => {
      cy.get("#c1-1").trigger("mousedown", {
        button: 0,
      });

      for (let i = stepsX; i >= 0; i -= 10) {
        cy.get("#c1-1").trigger("mousemove", {
          clientX: startingPointX + i,
          clientY: startingPointY + stepsY,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }

      for (let i = stepsY; i >= 0; i -= 10) {
        cy.get("#c1-1").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup event", () => {
      cy.get("#c1-1").trigger("mouseup", { force: true });
    });

    it("Siblings in the target are in positions", () => {
      cy.get("#c2-1").should("have.css", "transform", "none");

      cy.get("#c2-2").should("have.css", "transform", "none");

      cy.get("#c2-3").should("have.css", "transform", "none");

      cy.get("#c2-4").should("have.css", "transform", "none");

      cy.get("#c2-5").should("have.css", "transform", "none");
    });

    it("Dragged is back to its original position", () => {
      cy.get("#c1-1").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });
  }
);
