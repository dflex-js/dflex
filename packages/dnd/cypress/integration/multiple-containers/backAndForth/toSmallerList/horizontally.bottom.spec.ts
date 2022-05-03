context(
  "Transitioning from one container to another horizontally from the bottom - back and forth",
  () => {
    let elmBox: DOMRect;
    let startingPointX: number;
    let startingPointY: number;

    let stepsX = 0;
    // const stepsY = 0;

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
  }
);
