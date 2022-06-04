context(
  "Mixed Transformation: Into a different container, inside it, then add element(s) from another container",
  () => {
    let elmBox: DOMRect;
    let startingPointX: number;
    let startingPointY: number;

    let stepsX = 0;
    let stepsY = 0;

    before(() => {
      cy.visit("http://localhost:3001/migration");
    });

    context("Transforming into different container", () => {
      it("Getting the first element from orphan container", () => {
        cy.get("#c1-1").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          // eslint-disable-next-line no-unused-vars
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#c1-1").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms element (#c1-1) - outside the list above container-2", () => {
        stepsY = 110;
        for (let i = 0; i < stepsY; i += 10) {
          cy.get("#c1-1").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }

        stepsX = 231;
        for (let i = 0; i < stepsX; i += 10) {
          cy.get("#c1-1").trigger("mousemove", {
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Transforms element (#c1-1) - inside container-2", () => {
        // stepsY = 110;
        for (let i = stepsY; i >= 0; i -= 10) {
          cy.get("#c1-1").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Triggers mouseup event", () => {
        cy.get("#c1-1").trigger("mouseup", { force: true });
      });

      it("Migrated element(#c1-2) replaces #c2-1 position", () => {
        cy.get("#c1-1").then((elm) => {
          const newElmBox = elm[0].getBoundingClientRect();
          expect(newElmBox.top).to.equal(elmBox.top);
        });
      });

      it("Dragged takes new position in the new container-2", () => {
        cy.get("#c1-1").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 226, 0)"
        );
      });

      it("Siblings shifted down to place the new element", () => {
        cy.get("#c2-1").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 92)"
        );

        cy.get("#c2-2").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 92)"
        );

        cy.get("#c2-3").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 92)"
        );

        cy.get("#c2-4").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 92)"
        );

        cy.get("#c2-5").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 92)"
        );
      });
    });

    context("Transform the migrated element inside the new container", () => {
      it("Transform element (#c1-1) - inside the list one step up", () => {
        cy.get("#c1-1").trigger("mousedown", {
          button: 0,
        });

        stepsY = 110;
        for (let i = 0; i < stepsY; i += 10) {
          cy.get("#c1-1").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Siblings lifted up", () => {
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

        cy.get("#c2-5").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)"
        );
      });

      it("Triggers mouseup event", () => {
        cy.get("#c1-1").trigger("mouseup", { force: true });
      });

      it("Transform element (#c1-1) - inside the list before the last element", () => {
        cy.get("#c1-1").trigger("mousedown", {
          button: 0,
        });

        stepsY = 280;
        for (let i = 0; i < stepsY; i += 10) {
          cy.get("#c1-1").trigger("mousemove", {
            clientY: startingPointY + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Triggers mouseup event", () => {
        cy.get("#c1-1").trigger("mouseup", { force: true });
      });

      it("Siblings transform into new positions", () => {
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

        cy.get("#c2-5").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 92)"
        );
      });

      it("Transform element (#c1-1) - outside the container from the bottom", () => {
        cy.get("#c1-1").trigger("mousedown", {
          button: 0,
        });

        stepsY = 250;
        for (let i = stepsY; i < stepsY + 110; i += 10) {
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

      it("Siblings transform into new positions", () => {
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

        cy.get("#c2-5").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)"
        );
      });

      it("Dragged now position in the bottom of the new container", () => {
        cy.get("#c1-1").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 226, 310)"
        );
      });
    });

    context("Check the elements inside the host container c2", () => {
      it("Getting the first element c2-1", () => {
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

      it("Transforms element (#c2-1) - above outside the list", () => {
        stepsY = 80;
        for (let i = 0; i < stepsY; i += 10) {
          cy.get("#c2-1").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Siblings are lifted up", () => {
        cy.get("#c2-2").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -62)"
        );

        cy.get("#c2-3").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -62)"
        );

        cy.get("#c2-4").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -62)"
        );

        cy.get("#c2-5").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -62)"
        );

        cy.get("#c1-1").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 226, 248)"
        );
      });

      it("Triggers mouseup event", () => {
        cy.get("#c2-1").trigger("mouseup", { force: true });
      });
    });

    context("Transform element from container 3 into container 2", () => {
      it("Getting the first element from container-3", () => {
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
        stepsY = 110;
        for (let i = 0; i < stepsY; i += 10) {
          cy.get("#c3-1").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }

        stepsX = 231;
        for (let i = 0; i < stepsX; i += 10) {
          cy.get("#c3-1").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
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

      it("Siblings transform into new positions", () => {
        cy.get("#c2-1").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 112)"
        );

        cy.get("#c2-2").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 112)"
        );

        cy.get("#c2-3").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 112)"
        );

        cy.get("#c2-4").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 112)"
        );

        cy.get("#c2-5").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 112)"
        );
      });

      it("Transforms element (#c3-1) - down inside the list", () => {
        cy.get("#c3-1").trigger("mousedown", {
          button: 0,
        });

        stepsY = 365;
        for (let i = 0; i < stepsY; i += 10) {
          cy.get("#c3-1").trigger("mousemove", {
            clientY: startingPointY + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Trigger mouseup event", () => {
        cy.get("#c3-1").trigger("mouseup", {
          button: 0,
        });
      });

      it("Siblings transform into new positions", () => {
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

        cy.get("#c2-5").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)"
        );
      });

      it("Migrated elements positioned correctly", () => {
        cy.get("#c1-1").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 226, 422)"
        );

        cy.get("#c3-1").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, -226, 310)"
        );
      });
    });
  }
);
