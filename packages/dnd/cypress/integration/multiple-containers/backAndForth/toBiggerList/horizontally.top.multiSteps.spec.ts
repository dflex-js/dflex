context(
  "Transitioning from one container to multiple containers horizontally from the top - back and forth",
  () => {
    let elmBoxC3Elm1: DOMRect;
    let elmBoxC2Elm1: DOMRect;
    let elmBoxC1Elm1: DOMRect;

    let startingPointX: number;

    // eslint-disable-next-line no-unused-vars
    let startingPointY: number;

    let stepsX = 0;

    before(() => {
      cy.visit("http://localhost:3001/migration");
    });

    it("Getting the first element rect from containers", () => {
      cy.get("#c1-1").then((elm) => {
        elmBoxC1Elm1 = elm[0].getBoundingClientRect();
      });

      cy.get("#c2-1").then((elm) => {
        elmBoxC2Elm1 = elm[0].getBoundingClientRect();
      });

      cy.get("#c3-1").then((elm) => {
        elmBoxC3Elm1 = elm[0].getBoundingClientRect();
        startingPointX = elmBoxC3Elm1.x + elmBoxC3Elm1.width / 2;
        startingPointY = elmBoxC3Elm1.y + elmBoxC3Elm1.height / 2;

        cy.get("#c3-1").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (#c3-1) - outside the origin container(3) inside container(2)", () => {
      stepsX = 230;
      for (let i = 0; i < stepsX; i += 10) {
        cy.get("#c3-1").trigger("mousemove", {
          clientX: startingPointX - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(0);
      }
    });

    it("Triggers mouseup event", () => {
      cy.get("#c3-1").trigger("mouseup", { force: true });
    });

    it("Transforms element (#c3-1) - inside container(1)", () => {
      cy.get("#c3-1").trigger("mousedown", {
        button: 0,
      });

      stepsX = 230;
      for (let i = stepsX; i < stepsX + 230; i += 10) {
        cy.get("#c3-1").trigger("mousemove", {
          clientX: startingPointX - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(0);
      }
    });

    it("Triggers mouseup event", () => {
      cy.get("#c3-1").trigger("mouseup", { force: true });
    });
  }
);
