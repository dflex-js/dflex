context(
  "Distribute into different containers then transform into empty one",
  () => {
    let elmBox: DOMRect;
    let startingPointX: number;
    let startingPointY: number;

    let stepsX = 0;
    let stepsY = 0;

    before(() => {
      cy.visit("http://localhost:3001/migration");
    });

    context("Transform from to container-3 into (2)", () => {
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

      it("Transforms element (#c3-1) - outside the list above container-3", () => {
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

      it("Transforms element (#c3-1) - inside container-1", () => {
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

      it("Getting the first element from container-1", () => {
        cy.get("#c3-2").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          // eslint-disable-next-line no-unused-vars
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#c3-2").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms element (#c3-2) - outside the list above container-3", () => {
        stepsY = 90;
        for (let i = 0; i < stepsY; i += 10) {
          cy.get("#c3-2").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }

        stepsX = 470;
        for (let i = 0; i < stepsX; i += 10) {
          cy.get("#c3-2").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Transforms element (#c3-2) - inside container-1", () => {
        // stepsY = 110;
        for (let i = stepsY; i >= 0; i -= 10) {
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
  }
);
