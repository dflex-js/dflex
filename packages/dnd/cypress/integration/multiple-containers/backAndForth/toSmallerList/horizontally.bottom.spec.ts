context(
  "Transitioning from one container to another horizontally from the bottom - back and forth",
  () => {
    let elmBox: DOMRect;
    let startingPointX: number;
    let startingPointY: number;

    let stepsX = 0;
    let stepsY = 0;

    before(() => {
      cy.visit("http://localhost:3001/migration");
    });

    it("Getting the last element from container-1", () => {
      cy.get("#c2-5").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // eslint-disable-next-line no-unused-vars
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#c2-5").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (#c2-5) - outside the list above container-2", () => {
      stepsX = 231;
      for (let i = 0; i < stepsX; i += 10) {
        cy.get("#c2-5").trigger("mousemove", {
          clientX: startingPointX + i,
          clientY: startingPointY,

          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(0);
      }
    });

    it("Triggers mouseup event", () => {
      cy.get("#c2-5").trigger("mouseup", { force: true });
    });

    it("Siblings from the origin list in the same positions", () => {
      cy.get("#c2-1").should("have.css", "transform", "none");

      cy.get("#c2-2").should("have.css", "transform", "none");

      cy.get("#c2-3").should("have.css", "transform", "none");

      cy.get("#c2-4").should("have.css", "transform", "none");
    });

    it("Siblings in destination list in the same positions", () => {
      cy.get("#c3-1").should("have.css", "transform", "none");

      cy.get("#c3-2").should("have.css", "transform", "none");
    });

    it("Dragged settled in the new list", () => {
      cy.get("#c2-5").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 226, -24)"
      );
    });

    it("Transforms element (#c2-5) - back to the origin", () => {
      cy.get("#c2-5").trigger("mousedown", {
        button: 0,
      });

      for (let i = stepsX; i >= 0; i -= 10) {
        cy.get("#c2-5").trigger("mousemove", {
          clientX: startingPointX + i,
          clientY: startingPointY,

          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(0);
      }
    });

    it("Triggers mouseup event", () => {
      cy.get("#c2-5").trigger("mouseup", { force: true });
    });

    it("Siblings from the origin list in the same positions", () => {
      cy.get("#c2-1").should("have.css", "transform", "none");

      cy.get("#c2-2").should("have.css", "transform", "none");

      cy.get("#c2-3").should("have.css", "transform", "none");

      cy.get("#c2-4").should("have.css", "transform", "none");
    });

    it("Siblings in destination list in the same positions", () => {
      cy.get("#c3-1").should("have.css", "transform", "none");

      cy.get("#c3-2").should("have.css", "transform", "none");
    });

    it("Dragged is back to its origin", () => {
      cy.get("#c2-5").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });

    it("No layout shift happened to #c2-5", () => {
      cy.get("#c2-5").then((elm) => {
        const newElmBox = elm[0].getBoundingClientRect();

        expect(newElmBox).to.deep.equal(elmBox);
      });
    });

    it("Transforms element (#c2-5) - up in its origin", () => {
      cy.get("#c2-5").trigger("mousedown", {
        button: 0,
      });

      stepsY = 420;
      for (let i = 0; i < stepsY; i += 10) {
        cy.get("#c1-1").trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(0);
      }
    });

    it("Siblings should be lifted up", () => {
      cy.get("#c2-1").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#c2-2").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#c2-3").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#c2-4").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });
  }
);
