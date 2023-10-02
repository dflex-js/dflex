context(
  "Testing a list has different types of container restrictions - Horizontally",
  () => {
    let elmBox: DOMRect;
    let startingPointX: number;
    let startingPointY: number;

    before(() => {
      cy.visit("http://localhost:3001/restricted-container-diff");
    });

    context("Left only", () => {
      it("Getting element (#item-rest-container-left)", () => {
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(0);
        cy.get("#item-rest-container-left").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#item-rest-container-left").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms (#item-rest-container-left) to the left", () => {
        for (let i = 0; i <= 350; i += 10) {
          cy.get("#item-rest-container-left").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Dragged still inside the definition area", () => {
        cy.get("#item-rest-container-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );
      });

      it("Transforms (#item-rest-container-left) to the top", () => {
        for (let i = 0; i < 10; i += 1) {
          cy.get("#item-rest-container-left").trigger("mousemove", {
            clientY: 0,
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("All siblings are lifted up", () => {
        cy.get("#item-rest-container-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-left").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the right", () => {
        cy.get("#item-rest-container-left").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 220; i += 10) {
          cy.get("#item-rest-container-left").trigger("mousemove", {
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("All siblings are lifted up", () => {
        cy.get("#item-rest-container-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-left").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the bottom", () => {
        cy.get("#item-rest-container-left").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 500; i += 10) {
          cy.get("#item-rest-container-left").trigger("mousemove", {
            clientY: startingPointY + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-left").trigger("mouseup", {
          force: true,
        });
      });

      it("Siblings & dragged have new positions", () => {
        cy.get("#item-rest-container-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 515.125)",
        );

        cy.get("#item-rest-container-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-container-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );
      });
    });

    context("Right only", () => {
      it("Getting element (#item-rest-container-right)", () => {
        cy.get("#item-rest-container-right").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#item-rest-container-right").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms (#item-rest-container-right) to the right", () => {
        for (let i = 50; i >= 0; i -= 10) {
          cy.get("#item-rest-container-right").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Dragged still inside the definition area", () => {
        cy.get("#item-rest-container-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 515.125)",
        );
      });

      it("Transforms (#item-rest-container-right) to the top", () => {
        for (let i = 0; i < 10; i += 1) {
          cy.get("#item-rest-container-right").trigger("mousemove", {
            clientY: 0,
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("All siblings are lifted up", () => {
        cy.get("#item-rest-container-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 423.938)",
        );

        cy.get("#item-rest-container-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-container-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-container-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-container-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-container-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-right").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the bottom", () => {
        cy.get("#item-rest-container-right").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 500; i += 10) {
          cy.get("#item-rest-container-right").trigger("mousemove", {
            clientY: startingPointY + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-right").trigger("mouseup", {
          force: true,
        });
      });

      it("Siblings & dragged have new positions", () => {
        cy.get("#item-rest-container-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 423.938)",
        );

        cy.get("#item-rest-container-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 423.938)",
        );

        cy.get("#item-rest-container-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-container-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-container-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-container-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-container-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );
      });
    });

    context("Left & Right only", () => {
      it("Getting element (#item-rest-container-left-right)", () => {
        cy.get("#item-rest-container-left-right").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#item-rest-container-left-right").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms (#item-rest-container-left-right) to the left", () => {
        for (let i = 50; i >= 0; i -= 10) {
          cy.get("#item-rest-container-left-right").trigger("mousemove", {
            clientX: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Dragged still inside the definition area", () => {
        cy.get("#item-rest-container-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-left-right").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the right", () => {
        cy.get("#item-rest-container-left-right").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 220; i += 10) {
          cy.get("#item-rest-container-left-right").trigger("mousemove", {
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Dragged still inside the definition area", () => {
        cy.get("#item-rest-container-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-left-right").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the bottom", () => {
        cy.get("#item-rest-container-left-right").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 620; i += 10) {
          cy.get("#item-rest-container-left-right").trigger("mousemove", {
            clientY: startingPointY + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Dragged is outside the list", () => {
        cy.get("#item-rest-container-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 446.219)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-container-left-right").trigger("mouseup", {
          force: true,
        });
      });

      it("Siblings & dragged have new positions", () => {
        cy.get("#item-rest-container-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 340.75)",
        );

        cy.get("#item-rest-container-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 340.75)",
        );

        cy.get("#item-rest-container-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 340.75)",
        );

        cy.get("#item-rest-container-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -257.562)",
        );

        cy.get("#item-rest-container-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -257.562)",
        );

        cy.get("#item-rest-container-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -257.562)",
        );

        cy.get("#item-rest-container-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -257.562)",
        );
      });
    });
  },
);
