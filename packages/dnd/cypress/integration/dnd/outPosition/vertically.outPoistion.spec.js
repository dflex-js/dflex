let startingPointX;
let startingPointY;
let elmBox;

context("DnD/Testing is out position vertically", () => {
  before(() => {
    cy.visit("http://localhost:3001/");
  });

  context("Moving strict vertically one siblings - out down", () => {
    it("Transforms (container3 |> elm-2) out vertically", () => {
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
            clientY: startingPointY + ((2 / 3) * elmBox.height + 2),
            force: true,
          });
      });
    });

    it("Does not effect (container3 |> elm-1)", () => {
      cy.get("#id-9").should("have.css", "transform", "none");
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
      cy.get("#id-10").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#id-p3")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(4);
        });
    });

    it("Dragged takes new position switching the other element", () => {
      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 58)"
      );

      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("ELement not involved are not effected", () => {
      cy.get("#id-9").should("have.css", "transform", "none");
      cy.get("#id-12").should("have.css", "transform", "none");
    });
  });

  context("Moving strict vertically one siblings - out up", () => {
    it("Transforms (container3 |> elm-2) out up vertically", () => {
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
            clientY: startingPointY - ((2 / 3) * elmBox.height + 2),
            force: true,
          });
      });
    });

    it("Effects (container3 |> elm-3), moves it down", () => {
      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });

    it("Does not effect elements 9 and 12", () => {
      cy.get("#id-9").should("have.css", "transform", "none");
      cy.get("#id-12").should("have.css", "transform", "none");
    });

    it("Triggers mouseup", () => {
      cy.get("#id-10").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#id-p3")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(4);
        });
    });

    it("Effected elements are switched again", () => {
      cy.get("#id-9").should("have.css", "transform", "none");

      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#id-12").should("have.css", "transform", "none");
    });
  });

  context("Moving strict vertically multi siblings - out down", () => {
    it("Transforms (container3 |> elm-2) out down multi steps", () => {
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
            clientY: startingPointY + ((2 / 3) * elmBox.height + 2),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY:
              startingPointY + (2 * elmBox.height + (1 / 3) * elmBox.height),
            force: true,
          });
      });
    });

    it("Does not effect (container3 |> elm-1)", () => {
      cy.get("#id-9").should("have.css", "transform", "none");
    });

    it("Effects (container3 |> elm-3), lifts it up", () => {
      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Effects (container3 |> elm-4), lifts it up", () => {
      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Moves outside the parent preservers the last transformation", () => {
      cy.get("#id-10").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + (2 * elmBox.height + 2 * elmBox.height),
        force: true,
      });

      cy.get("#id-9").should("have.css", "transform", "none");

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

    it("Triggers mouseup", () => {
      cy.get("#id-10").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#id-p3")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(4);
        });
    });

    it("Effected elements are switched ", () => {
      cy.get("#id-9").should("have.css", "transform", "none");

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

  context("Moving strict vertically multi siblings - out up", () => {
    it("Transforms (container3 |> elm-3) out from above", () => {
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
            clientY: startingPointY - ((2 / 3) * elmBox.height + 2),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY:
              startingPointY - (2 * elmBox.height + (1 / 3) * elmBox.height),
            force: true,
          });
      });
    });

    it("Makes sure all siblings lifted up to fill the gap", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -116)"
      );
      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 58)"
      );
    });

    it("Moves outside the parent", () => {
      cy.get("#id-11").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY - (2 * elmBox.height + elmBox.height),
        force: true,
      });
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

    it("Resets all positions considering leaving from above is not suitable", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
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

      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 116)"
      );
    });
  });
});
