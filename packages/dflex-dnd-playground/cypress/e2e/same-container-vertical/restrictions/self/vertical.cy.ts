context(
  "Testing a list has different types of self restrictions - Vertically",
  () => {
    let elmBox: DOMRect;
    let startingPointX: number;
    let startingPointY: number;

    before(() => {
      cy.visit("http://localhost:3001/restricted-self");
    });

    context("Top only", () => {
      it("Getting element (#item-rest-top)", () => {
        cy.get("#item-rest-top").then((elm) => {
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#item-rest-top").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms (#item-rest-top) to the left", () => {
        for (let i = 0; i <= 230; i += 10) {
          cy.get("#item-rest-top").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Affected siblings are lifted up", () => {
        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-top").trigger("mouseup", {
          force: true,
        });
      });

      it("Non affected elements stay untouched", () => {
        cy.get("#item-rest-left").should("have.css", "transform", "none");

        cy.get("#item-rest-right").should("have.css", "transform", "none");

        cy.get("#item-rest-left-right").should("have.css", "transform", "none");
      });

      it("Elements go back to the initial positions", () => {
        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );

        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );
      });

      it("Transforms (#item-rest-top) to the right", () => {
        cy.get("#item-rest-top").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 250; i += 10) {
          cy.get("#item-rest-top").trigger("mousemove", {
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Affected siblings are lifted up", () => {
        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-top").trigger("mouseup", {
          force: true,
        });
      });

      it("Non affected elements stay untouched", () => {
        cy.get("#item-rest-left").should("have.css", "transform", "none");

        cy.get("#item-rest-right").should("have.css", "transform", "none");

        cy.get("#item-rest-left-right").should("have.css", "transform", "none");
      });

      it("Elements go back to the initial positions", () => {
        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );

        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );
      });

      it("Getting element again, transform it to the top", () => {
        cy.get("#item-rest-top").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 100; i += 10) {
          cy.get("#item-rest-top").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Dragged has not moved", () => {
        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-top").trigger("mouseup", {
          force: true,
        });
      });

      it("Non affected elements stay untouched", () => {
        cy.get("#item-rest-left").should("have.css", "transform", "none");

        cy.get("#item-rest-right").should("have.css", "transform", "none");

        cy.get("#item-rest-left-right").should("have.css", "transform", "none");
      });

      it("Elements keep the initial positions", () => {
        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );

        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );
      });

      it("Getting element again, transform it to the bottom", () => {
        cy.get("#item-rest-top").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 300; i += 10) {
          cy.get("#item-rest-top").trigger("mousemove", {
            clientY: startingPointY + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-top").trigger("mouseup", {
          force: true,
        });
      });

      it("Non affected elements stay untouched", () => {
        cy.get("#item-rest-left").should("have.css", "transform", "none");

        cy.get("#item-rest-right").should("have.css", "transform", "none");

        cy.get("#item-rest-left-right").should("have.css", "transform", "none");
      });

      it("Siblings & dragged have new positions", () => {
        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 257.562)",
        );
      });
    });

    context("Bottom only", () => {
      it("Getting element (#item-rest-bottom)", () => {
        cy.get("#item-rest-bottom").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#item-rest-bottom").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms (#item-rest-bottom) to the left", () => {
        for (let i = 0; i <= 350; i += 10) {
          cy.get("#item-rest-bottom").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Affected siblings are lifted up", () => {
        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-bottom").trigger("mouseup", {
          force: true,
        });
      });

      it("Non affected elements stay untouched", () => {
        cy.get("#item-rest-left").should("have.css", "transform", "none");

        cy.get("#item-rest-right").should("have.css", "transform", "none");

        cy.get("#item-rest-left-right").should("have.css", "transform", "none");
      });

      it("Elements go back to the initial positions", () => {
        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 257.562)",
        );
      });

      it("Transforms (#item-rest-bottom) to the right", () => {
        cy.get("#item-rest-bottom").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 300; i += 10) {
          cy.get("#item-rest-bottom").trigger("mousemove", {
            clientX: startingPointX + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Affected siblings are lifted up", () => {
        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-bottom").trigger("mouseup", {
          force: true,
        });
      });

      it("Non affected elements stay untouched", () => {
        cy.get("#item-rest-left").should("have.css", "transform", "none");

        cy.get("#item-rest-right").should("have.css", "transform", "none");

        cy.get("#item-rest-left-right").should("have.css", "transform", "none");
      });

      it("Elements go back to the initial positions", () => {
        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 257.562)",
        );
      });

      it("Getting element again, transform it to the bottom", () => {
        cy.get("#item-rest-bottom").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 10; i += 1) {
          cy.get("#item-rest-bottom").trigger("mousemove", {
            clientY: startingPointY + i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Dragged is inside the list", () => {
        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-bottom").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the top", () => {
        cy.get("#item-rest-bottom").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 310; i += 10) {
          cy.get("#item-rest-bottom").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Siblings are lifted up", () => {
        cy.get("#item-rest-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );

        cy.get("#item-rest-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );

        cy.get("#item-rest-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)",
        );

        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 166.375)",
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -174.375)",
        );
      });

      it("Getting element inside the list", () => {
        for (let i = 300; i >= 250; i -= 10) {
          cy.get("#item-rest-bottom").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(0);
        }
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-bottom").trigger("mouseup", {
          force: true,
        });
      });

      it("Siblings & dragged have new positions", () => {
        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -340.75)",
        );

        cy.get("#item-rest-left").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 91.1875)",
        );

        cy.get("#item-rest-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 91.1875)",
        );

        cy.get("#item-rest-left-right").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 91.1875)",
        );

        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 257.562)",
        );

        cy.get("#item-rest-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -340.75)",
        );

        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );
      });
    });

    context("Top & bottom", () => {
      it("Getting element (#item-rest-top-bottom)", () => {
        cy.get("#item-rest-top-bottom").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          cy.get("#item-rest-top-bottom").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Transforms (#item-rest-top-bottom) to the left", () => {
        for (let i = 0; i <= 350; i += 10) {
          cy.get("#item-rest-top-bottom").trigger("mousemove", {
            clientX: startingPointX - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Affected siblings are lifted up", () => {
        cy.get("#item-rest-top").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 174.375)",
        );

        cy.get("#item-rest-all").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -166.375)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-top-bottom").trigger("mouseup", {
          force: true,
        });
      });

      it("Getting element again, transform it to the top", () => {
        cy.get("#item-rest-top-bottom").trigger("mousedown", {
          button: 0,
        });

        for (let i = 0; i <= 10; i += 1) {
          cy.get("#item-rest-top-bottom").trigger("mousemove", {
            clientY: startingPointY - i,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(0);
        }
      });

      it("Dragged has not moved", () => {
        cy.get("#item-rest-top-bottom").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -83.1875)",
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#item-rest-top-bottom").trigger("mouseup", {
          force: true,
        });
      });
    });
  },
);
