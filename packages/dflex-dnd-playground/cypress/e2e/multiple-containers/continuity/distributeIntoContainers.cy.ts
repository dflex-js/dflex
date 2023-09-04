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

    context("Transform from to container-1", () => {
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
          // cy.wait(0);
        }

        stepsX = 470;
        for (let i = 0; i < stepsX; i += 10) {
          cy.get("#c3-1").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
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

      it("Siblings from the targets are having new positions", () => {
        cy.get("#c3-2").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -112)",
        );
      });

      it("Siblings in origin takes new positions", () => {
        cy.get("#c1-1").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 112)",
        );
      });

      it("Dragged has fully transformed", () => {
        cy.get("#c3-1").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, -452, 0)",
        );
      });
    });

    context("Transform from to container-2", () => {
      it("Getting the second element from container-1", () => {
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
          // cy.wait(0);
        }

        stepsX = 235;
        for (let i = 0; i < stepsX; i += 10) {
          cy.get("#c3-2").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Transforms element (#c3-2) - inside container-2", () => {
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

      it("Siblings from the container-1 preserve their positions", () => {
        cy.get("#c1-1").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 112)",
        );
      });

      it("Siblings from the container-2 transformed into new positions", () => {
        cy.get("#c2-1").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 112)",
        );

        cy.get("#c2-2").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 112)",
        );

        cy.get("#c2-3").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 112)",
        );

        cy.get("#c2-4").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 112)",
        );

        cy.get("#c2-5").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 112)",
        );
      });

      it("Siblings from container-3 are distributed into two containers", () => {
        cy.get("#c3-1").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, -452, 0)",
        );

        cy.get("#c3-2").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, -226, -112)",
        );
      });
    });

    context("Transform the last element in container-2 to container-3", () => {
      it("Getting the last element from container-2", () => {
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

      it("Transforms element (#c2-5) to container-3", () => {
        stepsX = 231;
        for (let i = 0; i < stepsX; i += 10) {
          cy.get("#c2-5").trigger("mousemove", {
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }

        stepsY = 315;
        for (let i = 0; i < stepsY; i += 10) {
          cy.get("#c2-5").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Triggers mouseup event", () => {
        cy.get("#c2-5").trigger("mouseup", { force: true });
      });
    });

    context(
      "Ensure transformed elements have been positioned correctly",
      () => {
        it("Dragged #c3-1 settled in container-1 correctly", () => {
          cy.get("#c3-1").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, -452, 0)",
          );
        });

        it("Dragged #c3-2 settled in container-2 correctly", () => {
          cy.get("#c3-2").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, -226, -112)",
          );
        });

        it("Dragged #c2-5 settled in container-3 correctly", () => {
          cy.get("#c2-5").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 226, -248)",
          );
        });

        it("Siblings in container 2 positioned correctly", () => {
          cy.get("#c2-1").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, 112)",
          );

          cy.get("#c2-2").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, 112)",
          );

          cy.get("#c2-3").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, 112)",
          );

          cy.get("#c2-4").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, 112)",
          );
        });

        it("Siblings in container 1 positioned correctly", () => {
          cy.get("#c1-1").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, 112)",
          );
        });
      },
    );
  },
);
