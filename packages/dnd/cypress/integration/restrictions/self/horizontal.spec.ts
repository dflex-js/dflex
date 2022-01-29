context(
  "Testing a list has different types of self restrictions - Horizontally",
  () => {
    let elmBox: DOMRect;
    let startingPointX: number;
    let startingPointY: number;

    before(() => {
      cy.visit("http://localhost:3001/restricted-self");
    });

    context("Left only", () => {
      it("Getting element (#item-rest-left)", () => {
        cy.get("#item-rest-left").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#item-rest-left").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms (#item-rest-left) to the left", () => {
        for (let i = 0; i <= 350; i += 10) {
          cy.get("#item-rest-left").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Dragged still inside the definition area", () => {
        cy.get("#item-rest-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)"
        );
      });

      it("Transforms (#item-rest-left) to the top", () => {
        for (let i = 0; i < 10; i += 1) {
          cy.get("#item-rest-left").trigger("mousemove", {
            clientY: 0,
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("All siblings are lifted up", () => {
        cy.get("#item-rest-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-left").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the right", () => {
        cy.get("#item-rest-left").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 220; i += 10) {
          cy.get("#item-rest-left").trigger("mousemove", {
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("All siblings are lifted up", () => {
        cy.get("#item-rest-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-left").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the bottom", () => {
        cy.get("#item-rest-left").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 500; i += 10) {
          cy.get("#item-rest-left").trigger("mousemove", {
            clientY: startingPointY + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-left").trigger("mouseup", {
          force: true,
        });
      });

      it("Siblings & dragged have new positions", () => {
        cy.get("#item-rest-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 515.125)"
        );

        cy.get("#item-rest-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)"
        );
      });
    });

    context("Right only", () => {
      it("Getting element (#item-rest-right)", () => {
        cy.get("#item-rest-right").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#item-rest-right").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms (#item-rest-right) to the right", () => {
        for (let i = 50; i >= 0; i -= 10) {
          cy.get("#item-rest-right").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // // cy.wait(0);
        }
      });

      it("Dragged still inside the definition area", () => {
        cy.get("#item-rest-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 515.125)"
        );
      });

      it("Transforms (#item-rest-right) to the top", () => {
        for (let i = 0; i < 10; i += 1) {
          cy.get("#item-rest-right").trigger("mousemove", {
            clientY: 0,
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // // cy.wait(0);
        }
      });

      it("All siblings are lifted up", () => {
        cy.get("#item-rest-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 423.938)"
        );

        cy.get("#item-rest-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)"
        );

        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)"
        );

        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)"
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)"
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)"
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-right").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the bottom", () => {
        cy.get("#item-rest-right").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 500; i += 10) {
          cy.get("#item-rest-right").trigger("mousemove", {
            clientY: startingPointY + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // // cy.wait(0);
        }
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-right").trigger("mouseup", {
          force: true,
        });
      });

      it("Siblings & dragged have new positions", () => {
        cy.get("#item-rest-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 423.938)"
        );

        cy.get("#item-rest-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 423.938)"
        );

        cy.get("#item-rest-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)"
        );

        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)"
        );

        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)"
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)"
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)"
        );
      });
    });
  }
);
