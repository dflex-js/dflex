context(
  "Transitioning from one container to another horizontally - back and forth",
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

    it("Transforms element (#c3-2) - outside the destination", () => {
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
  }
);
