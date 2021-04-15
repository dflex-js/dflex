/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
let startingPointX;
let startingPointY;
let elmBox;

function myContext() {
  context(
    "DnD/Testing occupying multiple positions vertically: switching down/up",
    () => {
      context(
        "Moving (container3 |> elm-1) down to occupy (container3 |> elm-2) position",
        () => {
          it("Transforms (container3 |> elm-2) out", () => {
            cy.get("#id-9").then((elm) => {
              elmBox = elm[0].getBoundingClientRect();

              startingPointX = elmBox.x + elmBox.width / 2;
              startingPointY = elmBox.y + elmBox.height / 2;

              cy.get("#id-9")
                .trigger("mousedown", {
                  button: 0,
                })
                .trigger("mousemove", {
                  clientX: startingPointX,
                  clientY: startingPointY + ((1 / 3) * elmBox.height + 8),
                  force: true,
                })
                .trigger("mousemove", {
                  clientX: startingPointX,
                  clientY: startingPointY + ((2 / 3) * elmBox.height + 8),
                  force: true,
                })
                .trigger("mousemove", {
                  clientX: startingPointX,
                  clientY: startingPointY + ((3 / 3) * elmBox.height + 8),
                  force: true,
                });
            });
          });

          it("Does not effect (container3 |> elm-3)", () => {
            cy.get("#id-11").should("have.css", "transform", "none");
          });

          it("Does not effect (container3 |> elm-4)", () => {
            cy.get("#id-12").should("have.css", "transform", "none");
          });

          it("Triggers mouseup", () => {
            cy.get("#id-9").trigger("mouseup", { force: true });
          });

          it("Makes sure list has four elements", () => {
            cy.get("#id-p3")
              .should("not.be.empty")
              .and(($li) => {
                expect($li[0].children).to.have.length(4);
              });
          });

          it("All elements preserve their positions", () => {
            cy.get("#id-9").should(
              "have.css",
              "transform",
              "matrix(1, 0, 0, 1, 0, 58)"
            );

            cy.get("#id-10").should(
              "have.css",
              "transform",
              "matrix(1, 0, 0, 1, 0, -58)"
            );

            cy.get("#id-11").should("have.css", "transform", "none");

            cy.get("#id-12").should("have.css", "transform", "none");
          });
        }
      );

      context("Moving (container3 |> elm-1) down to occupy 11 position", () => {
        it("Transforms (container3 |> elm-2) out", () => {
          cy.get("#id-9").then((elm) => {
            elmBox = elm[0].getBoundingClientRect();

            startingPointX = elmBox.x + elmBox.width / 2;
            startingPointY = elmBox.y + elmBox.height / 2;

            cy.get("#id-9")
              .trigger("mousedown", {
                button: 0,
              })
              .trigger("mousemove", {
                clientX: startingPointX,
                clientY: startingPointY + ((1 / 3) * elmBox.height + 8),
                force: true,
              })
              .trigger("mousemove", {
                clientX: startingPointX,
                clientY: startingPointY + ((2 / 3) * elmBox.height + 8),
                force: true,
              })
              .trigger("mousemove", {
                clientX: startingPointX,
                clientY: startingPointY + ((3 / 3) * elmBox.height + 8),
                force: true,
              });
          });
        });

        it("Does not effect (container3 |> elm-2)", () => {
          cy.get("#id-10").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
        });

        it("Effects (container3 |> elm-3), lifts it up", () => {
          cy.get("#id-11").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
        });

        it("Does not effect (container3 |> elm-4)", () => {
          cy.get("#id-12").should("have.css", "transform", "none");
        });

        it("Triggers mouseup", () => {
          cy.get("#id-9").trigger("mouseup", { force: true });
        });

        it("Makes sure list has four elements", () => {
          cy.get("#id-p3")
            .should("not.be.empty")
            .and(($li) => {
              expect($li[0].children).to.have.length(4);
            });
        });

        it("All elements preserve their positions", () => {
          cy.get("#id-9").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, 116)"
          );

          cy.get("#id-10").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );

          cy.get("#id-11").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );

          cy.get("#id-12").should("have.css", "transform", "none");
        });
      });

      context("Moving (container3 |> elm-1) down to occupy 12 position", () => {
        it("Transforms (container3 |> elm-2) out", () => {
          cy.get("#id-9").then((elm) => {
            elmBox = elm[0].getBoundingClientRect();

            startingPointX = elmBox.x + elmBox.width / 2;
            startingPointY = elmBox.y + elmBox.height / 2;

            cy.get("#id-9")
              .trigger("mousedown", {
                button: 0,
              })
              .trigger("mousemove", {
                clientX: startingPointX,
                clientY: startingPointY + ((1 / 3) * elmBox.height + 8),
                force: true,
              })
              .trigger("mousemove", {
                clientX: startingPointX,
                clientY: startingPointY + ((2 / 3) * elmBox.height + 8),
                force: true,
              })
              .trigger("mousemove", {
                clientX: startingPointX,
                clientY: startingPointY + ((3 / 3) * elmBox.height + 8),
                force: true,
              });
          });
        });

        it("Does not effect (container3 |> elm-2)", () => {
          cy.get("#id-10").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
        });

        it("Does not effect (container3 |> elm-3)", () => {
          cy.get("#id-11").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
        });

        it("Effect (container3 |> elm-4), lifts it up", () => {
          cy.get("#id-12").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
        });

        it("Triggers mouseup", () => {
          cy.get("#id-9").trigger("mouseup", { force: true });
        });

        it("Makes sure list has four elements", () => {
          cy.get("#id-p3")
            .should("not.be.empty")
            .and(($li) => {
              expect($li[0].children).to.have.length(4);
            });
        });

        it("All elements preserve their positions", () => {
          cy.get("#id-9").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, 174)"
          );

          cy.get("#id-10").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );

          cy.get("#id-11").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );

          cy.get("#id-12").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
        });
      });

      context(
        "Moving (container3 |> elm-2) down, to occupy 11 position",
        () => {
          it("Transforms (container3 |> elm-2) out", () => {
            cy.get("#id-10").then((elm) => {
              elmBox = elm[0].getBoundingClientRect();

              startingPointX = elmBox.x + elmBox.width / 2;
              startingPointY = elmBox.y + elmBox.height / 2;

              cy.get("#id-10")
                .trigger("mousedown", {
                  button: 0,
                })
                .trigger("mousemove", {
                  clientX: startingPointX,
                  clientY: startingPointY + ((1 / 3) * elmBox.height + 8),
                  force: true,
                })
                .trigger("mousemove", {
                  clientX: startingPointX,
                  clientY: startingPointY + ((2 / 3) * elmBox.height + 8),
                  force: true,
                })
                .trigger("mousemove", {
                  clientX: startingPointX,
                  clientY: startingPointY + ((3 / 3) * elmBox.height + 8),
                  force: true,
                });
            });
          });

          it("Effects (container3 |> elm-3), lifts it up", () => {
            cy.get("#id-11").should(
              "have.css",
              "transform",
              "matrix(1, 0, 0, 1, 0, -116)"
            );
          });

          it("Does not effect (container3 |> elm-4)", () => {
            cy.get("#id-12").should(
              "have.css",
              "transform",
              "matrix(1, 0, 0, 1, 0, -58)"
            );
          });

          it("Does not effect (container3 |> elm-1)", () => {
            cy.get("#id-9").should(
              "have.css",
              "transform",
              "matrix(1, 0, 0, 1, 0, 174)"
            );
          });

          it("Triggers mouseup", () => {
            cy.get("#id-9").trigger("mouseup", { force: true });
          });

          it("Makes sure list has four elements", () => {
            cy.get("#id-p3")
              .should("not.be.empty")
              .and(($li) => {
                expect($li[0].children).to.have.length(4);
              });
          });

          it("All elements preserve their positions", () => {
            cy.get("#id-9").should(
              "have.css",
              "transform",
              "matrix(1, 0, 0, 1, 0, 174)"
            );

            cy.get("#id-10").should(
              "have.css",
              "transform",
              "matrix(1, 0, 0, 1, 0, 0)"
            );

            cy.get("#id-11").should(
              "have.css",
              "transform",
              "matrix(1, 0, 0, 1, 0, -116)"
            );

            cy.get("#id-12").should(
              "have.css",
              "transform",
              "matrix(1, 0, 0, 1, 0, -58)"
            );
          });
        }
      );
    }
  );

  context("DnD/Testing occupying multiple positions vertically up", () => {
    it("Transforms (container3 |> elm-1) out - one sibling to 12", () => {
      cy.get("#id-9").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();

        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#id-9")
          .trigger("mousedown", {
            button: 0,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY - ((1 / 3) * elmBox.height + 8),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY - ((2 / 3) * elmBox.height + 8),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY - ((3 / 3) * elmBox.height + 8),
            force: true,
          });
      });
    });

    it("Transforms (container3 |> elm-1) out - two siblings to 10", () => {
      cy.get("#id-9")
        .trigger("mousemove", {
          clientX: startingPointX,
          clientY:
            startingPointY -
            ((1 / 3) * elmBox.height + (3 / 3) * elmBox.height + 8),
          force: true,
        })
        .trigger("mousemove", {
          clientX: startingPointX,
          clientY:
            startingPointY -
            ((2 / 3) * elmBox.height + (3 / 3) * elmBox.height + 2 * 8),
          force: true,
        })
        .trigger("mousemove", {
          clientX: startingPointX,
          clientY:
            startingPointY -
            ((3 / 3) * elmBox.height + (3 / 3) * elmBox.height + 2 * 8),
          force: true,
        });
    });

    it("Triggers mouseup", () => {
      cy.get("#id-9").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#id-p3")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(4);
        });
    });

    it("Does not effect (container3 |> elm-3)", () => {
      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -116)"
      );
    });

    it("Puts (container3 |> elm-1) in a new position ", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 58)"
      );
    });

    it("Puts (container3 |> elm-2) in a new position ", () => {
      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 58)"
      );
    });

    it("Puts (container3 |> elm-4) in a new position ", () => {
      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });

    it("Moves (container3 |> elm-3) outside the parent", () => {
      cy.get("#id-11").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();

        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#id-11")
          .trigger("mousedown", {
            button: 0,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY - ((1 / 3) * elmBox.height + 8),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY - ((2 / 3) * elmBox.height + 8),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY - ((3 / 3) * elmBox.height + 8),
            force: true,
          });
      });
    });

    it("Lifts all siblings up", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Triggers mouseup", () => {
      cy.get("#id-11").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#id-p3")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(4);
        });
    });

    it("Resets all elements positions", () => {
      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -116)"
      );

      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 58)"
      );

      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 58)"
      );

      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });
  });
}

context(
  "DnD/Testing switching down/up & occupying multiple positions vertically up",
  () => {
    const URLs = [
      {
        url: "http://localhost:3001/",
        desc: "Testing Container Based Event",
      },
    ];

    if (Cypress.env("extended")) {
      URLs.push({
        url: "http://localhost:3001/component-based-event",
        desc: "Testing Component Based Event",
      });
    }

    URLs.forEach(({ url, desc }) => {
      context(desc, () => {
        before(() => {
          cy.visit(url);
        });

        myContext();
      });
    });
  }
);
