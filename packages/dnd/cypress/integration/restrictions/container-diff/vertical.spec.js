/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

let elmBox;
let startingPointX;
let startingPointY;

context(
  "Testing a list has different types of container restrictions - Vertically",
  () => {
    before(() => {
      cy.visit("http://localhost:3001/restricted-container-diff");
    });

    context("Top only", () => {
      it("Getting element (#item-rest-container-top)", () => {
        cy.get("#item-rest-container-top").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#item-rest-container-top").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms (#item-rest-container-top) to the left", () => {
        for (let i = 0; i <= 350; i += 10) {
          cy.get("#item-rest-container-top").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Affected siblings are lifted up", () => {
        cy.get("#item-rest-container-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-container-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-container-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-top").trigger("mouseup", {
          force: true,
        });
      });

      it("Transforms (#item-rest-container-top) to the right", () => {
        cy.get("#item-rest-container-top").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 250; i += 10) {
          cy.get("#item-rest-container-top").trigger("mousemove", {
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Affected siblings are lifted up", () => {
        cy.get("#item-rest-container-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-container-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-container-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-top").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the bottom", () => {
        cy.get("#item-rest-container-top").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 320; i += 10) {
          cy.get("#item-rest-container-top").trigger("mousemove", {
            clientY: startingPointY + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Dragged is outside the list", () => {
        cy.get("#item-rest-container-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, -9, 320.156)"
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-top").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the top", () => {
        cy.get("#item-rest-container-top").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 600; i += 10) {
          cy.get("#item-rest-container-top").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Dragged is inside the list", () => {
        cy.get("#item-rest-container-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -257.844)"
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-top").trigger("mouseup", {
          force: true,
        });
      });

      it("Siblings & dragged have new positions", () => {
        cy.get("#item-rest-container-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -257.562)"
        );

        cy.get("#item-rest-container-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 83.1875)"
        );

        cy.get("#item-rest-container-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 83.1875)"
        );

        cy.get("#item-rest-container-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 83.1875)"
        );

        cy.get("#item-rest-container-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)"
        );

        cy.get("#item-rest-container-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)"
        );

        cy.get("#item-rest-container-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)"
        );
      });
    });

    context("Bottom only", () => {
      it("Getting element (#item-rest-container-bottom)", () => {
        cy.get("#item-rest-container-bottom").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#item-rest-container-bottom").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms (#item-rest-container-bottom) to the left", () => {
        for (let i = 0; i <= 350; i += 10) {
          cy.get("#item-rest-container-bottom").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Affected siblings are lifted up", () => {
        cy.get("#item-rest-container-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -91.1875)"
        );

        cy.get("#item-rest-container-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -91.1875)"
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-bottom").trigger("mouseup", {
          force: true,
        });
      });

      it("Transforms (#item-rest-container-bottom) to the right", () => {
        cy.get("#item-rest-container-bottom").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 300; i += 10) {
          cy.get("#item-rest-container-bottom").trigger("mousemove", {
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Affected siblings are lifted up", () => {
        cy.get("#item-rest-container-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -91.1875)"
        );

        cy.get("#item-rest-container-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -91.1875)"
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-bottom").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the bottom", () => {
        cy.get("#item-rest-container-bottom").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 300; i += 10) {
          cy.get("#item-rest-container-bottom").trigger("mousemove", {
            clientY: startingPointY + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Dragged is inside the list", () => {
        cy.get("#item-rest-container-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 166.719)"
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-bottom").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the top", () => {
        cy.get("#item-rest-container-bottom").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 400; i += 10) {
          cy.get("#item-rest-container-bottom").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Siblings are lifted up", () => {
        cy.get("#item-rest-container-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 83.1875)"
        );

        cy.get("#item-rest-container-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 83.1875)"
        );

        cy.get("#item-rest-container-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 83.1875)"
        );

        cy.get("#item-rest-container-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -257.562)"
        );

        cy.get("#item-rest-container-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -91.1875)"
        );

        cy.get("#item-rest-container-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -91.1875)"
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-bottom").trigger("mouseup", {
          force: true,
        });
      });
    });
  }
);
