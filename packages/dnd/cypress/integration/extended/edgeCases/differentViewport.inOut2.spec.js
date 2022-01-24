let elmBox;
let startingPointX;
// eslint-disable-next-line no-unused-vars
let startingPointY;

let stepsX = 0;

context(
  "Testing lifting elements up with visibility and scroll - Start from the begging (2)",
  () => {
    before(() => {
      cy.visit("http://localhost:3001/extended");
    });

    context("Drag out first element (1)", () => {
      it("Getting the first element (1)", () => {
        cy.get("#1-extended").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          // eslint-disable-next-line no-unused-vars
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#1-extended").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms element (1) - outside the list", () => {
        stepsX = 240;

        for (let i = 0; i < stepsX; i += 10) {
          cy.get("#1-extended").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });

          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Visible elements all are lifted up", () => {
        for (let i = 2; i < 11; i += 1) {
          cy.get(`#${i}-extended`).should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -59.1875)"
          );
        }
      });

      it("Dataset index updated for dragged", () => {
        cy.get(`#${1}-extended`).then((elm) => {
          const { index } = elm[0].dataset;
          expect(index).to.be.eq(`-1`);
        });
      });

      it("dragged-element has dragged attribute", () => {
        cy.get(`#${1}-extended`).then((elm) => {
          const dragged = elm[0].getAttribute("dragged");
          expect(dragged).to.be.eq(`true`);
        });
      });

      it("All sibling dataset index is updated", () => {
        for (let i = 2; i < 100; i += 1) {
          cy.get(`#${i}-extended`).then((elm) => {
            const { index } = elm[0].dataset;
            expect(index).to.be.eq(`${i - 2}`);
          });
        }
      });

      it("Invisible elements are not transformed", () => {
        for (let i = 20; i < 100; i += 10) {
          cy.get(`#${i}-extended`).should("have.css", "transform", "none");
        }
      });
    });

    context("Release", () => {
      it("Release Dragged", () => {
        cy.get("#1-extended").trigger("mouseup", { force: true });
      });

      it("dragged-element has dragged attribute", () => {
        cy.get(`#${1}-extended`).then((elm) => {
          const dragged = elm[0].getAttribute("dragged");
          expect(dragged).to.be.eq(null);
        });
      });

      it("Visible elements have zero transformation", () => {
        for (let i = 2; i < 11; i += 10) {
          cy.get(`#${i}-extended`).should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, 0)"
          );
        }
      });

      it("Invisible elements are not transformed", () => {
        for (let i = 20; i < 100; i += 1) {
          cy.get(`#${i}-extended`).should("have.css", "transform", "none");
        }
      });

      it("Checking dataset index stays the same", () => {
        for (let i = 1; i < 99; i += 1) {
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.get(`#${i}-extended`).then((elm) => {
            const { index } = elm[0].dataset;

            expect(index).to.be.eq(`${i - 1}`);
          });
        }
      });
    });

    context("Drag out element 90", () => {
      it("Scroll to element 90", () => {
        cy.get("#90-extended").scrollIntoView({
          duration: 200,
          easing: "linear",
        });
      });

      it("Getting element (90)", () => {
        cy.get("#90-extended").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          // eslint-disable-next-line no-unused-vars
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#90-extended").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms element (90) - outside the list", () => {
        stepsX = 240;

        for (let i = 0; i < stepsX; i += 10) {
          cy.get("#90-extended").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });

          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Visible elements all are lifted up", () => {
        for (let i = 91; i < 100; i += 1) {
          cy.get(`#${i}-extended`).should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -59.1875)"
          );
        }
      });

      it("Release Dragged", () => {
        cy.get("#90-extended").trigger("mouseup", { force: true });
      });

      it("Checking dataset index stays the same", () => {
        for (let i = 1; i < 99; i += 1) {
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0)
            .get(`#${i}-extended`)
            .then((elm) => {
              const { index } = elm[0].dataset;

              expect(index).to.be.eq(`${i - 1}`);
            });
        }
      });
    });
  }
);
