context(
  "Testing lifting elements up with visibility and scroll - Start from the end (1)",
  () => {
    let elmBox: DOMRect;
    let startingPointX: number;
    // eslint-disable-next-line no-unused-vars
    let startingPointY: number;

    let stepsX = 0;
    // const stepsY = 0;

    before(() => {
      cy.visit("http://localhost:3001/extended");
    });

    context("Scroll to element 90", () => {
      it("Scroll to element 90", () => {
        cy.get("#90-extended").scrollIntoView({
          duration: 0,
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

      it("Dataset index updated for dragged", () => {
        cy.get(`#${90}-extended`).then((elm) => {
          const { index } = elm[0].dataset;
          expect(index).to.be.eq(`NaN`);
        });
      });

      it("dragged-element has dragged attribute", () => {
        cy.get(`#${90}-extended`).then((elm) => {
          const dragged = elm[0].getAttribute("dragged");
          expect(dragged).to.be.eq(`true`);
        });
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

      it("Invisible elements are not transformed", () => {
        for (let i = 1; i < 90; i += 1) {
          cy.get(`#${i}-extended`).should("have.css", "transform", "none");
        }
      });

      it("Elements are back", () => {
        for (let i = 91; i < 100; i += 1) {
          cy.get(`#${i}-extended`).should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, 0)"
          );
        }
      });

      // TODO: why it fails?
      it.skip("Checking dataset index stays the same", () => {
        for (let i = 1; i < 99; i += 1) {
          cy.get(`#${i}-extended`).then((elm) => {
            const { index } = elm[0].dataset;

            expect(index).to.be.eq(`${i - 1}`);
          });
        }
      });
    });

    context("Scroll to element 1", () => {
      it("Scroll to element 1", () => {
        cy.get("#1-extended").scrollIntoView({
          duration: 0,
        });
      });

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

      it("Dataset index updated for dragged", () => {
        cy.get(`#${1}-extended`).then((elm) => {
          const { index } = elm[0].dataset;
          expect(index).to.be.eq(`NaN`);
        });
      });

      it("dragged-element has dragged attribute", () => {
        cy.get(`#${1}-extended`).then((elm) => {
          const dragged = elm[0].getAttribute("dragged");
          expect(dragged).to.be.eq(`true`);
        });
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

      it("Release Dragged", () => {
        cy.get("#1-extended").trigger("mouseup", { force: true });
      });

      it("Elements are back", () => {
        for (let i = 2; i < 11; i += 1) {
          cy.get(`#${i}-extended`).should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, 0)"
          );
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

    context("Scroll to element 60", () => {
      it("Scroll to element 60", () => {
        cy.get("#60-extended").scrollIntoView({
          duration: 0,
        });
      });

      it("Getting element (60)", () => {
        cy.get("#60-extended").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          // eslint-disable-next-line no-unused-vars
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#60-extended").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms element (60) - outside the list", () => {
        stepsX = 240;

        for (let i = 0; i < stepsX; i += 10) {
          cy.get("#60-extended").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Dataset index updated for dragged", () => {
        cy.get(`#${60}-extended`).then((elm) => {
          const { index } = elm[0].dataset;
          expect(index).to.be.eq(`NaN`);
        });
      });

      it("dragged-element has dragged attribute", () => {
        cy.get(`#${60}-extended`).then((elm) => {
          const dragged = elm[0].getAttribute("dragged");
          expect(dragged).to.be.eq(`true`);
        });
      });

      it("Visible elements all are lifted up", () => {
        for (let i = 61; i < 72; i += 1) {
          cy.get(`#${i}-extended`).should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -59.1875)"
          );
        }
      });

      it("Release Dragged", () => {
        cy.get("#60-extended").trigger("mouseup", { force: true });
      });

      it("Elements are back", () => {
        for (let i = 61; i < 72; i += 1) {
          cy.get(`#${i}-extended`).should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, 0)"
          );
        }
      });

      it("Checking dataset index stays the same", () => {
        for (let i = 1; i < 99; i += 1) {
          cy.get(`#${i}-extended`).then((elm) => {
            const { index } = elm[0].dataset;

            expect(index).to.be.eq(`${i - 1}`);
          });
        }
      });
    });
  }
);
