context(
  "Transitioning from one container to another when dragged is smaller than the target",
  () => {
    let elmBox: DOMRect;
    let startingPointX: number;
    let startingPointY: number;

    let stepsX = 0;
    let stepsY = 0;

    before(() => {
      cy.visit("http://localhost:3001/migration");
    });

    it("Getting the first element from container-2", () => {
      cy.get("#c2-1").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // eslint-disable-next-line no-unused-vars
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#c2-1").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (#c2-1) - outside the list above container-2", () => {
      stepsY = 110;
      for (let i = 0; i < stepsY; i += 10) {
        cy.get("#c2-1").trigger("mousemove", {
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(0);
      }

      stepsX = 231;
      for (let i = 0; i < stepsX; i += 10) {
        cy.get("#c2-1").trigger("mousemove", {
          clientX: startingPointX - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(0);
      }
    });

    it("Transforms element (#c2-1) - inside container-2", () => {
      // stepsY = 110;
      for (let i = stepsY; i >= 0; i -= 10) {
        cy.get("#c2-1").trigger("mousemove", {
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(0);
      }
    });

    it("Triggers mouseup event", () => {
      cy.get("#c2-1").trigger("mouseup", { force: true });
    });

    it("Siblings in the origin list have new positions", () => {
      cy.get("#c2-2").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -62)",
      );

      cy.get("#c2-3").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -62)",
      );

      cy.get("#c2-4").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -62)",
      );

      cy.get("#c2-5").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -62)",
      );
    });

    it("Siblings in the destination list have new positions", () => {
      cy.get("#c1-1").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 62)",
      );

      cy.get("#c2-1").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, -226, 0)",
      );
    });
  },
);
