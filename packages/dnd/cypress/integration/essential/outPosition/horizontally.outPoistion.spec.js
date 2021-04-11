// / <reference types="cypress" />

let startingPointX;
let startingPointY;
let elmBox;

function myContext() {
  context("Moving strict horizontally - out form the right", () => {
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
            clientX: startingPointX + ((2 / 3) * elmBox.width + 2),
            clientY: startingPointY,
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

    it("Resets all positions", () => {
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

      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });
  });

  context("Moving strict horizontally - out form the left", () => {
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
            clientX: startingPointX - ((2 / 3) * elmBox.width + 2),
            clientY: startingPointY,
            force: true,
          });
      });
    });

    it("Does not effect (container3 |> elm-1)", () => {
      cy.get("#id-9").should("have.css", "transform", "none");
    });

    it("Effects (container3 |> elm-3),  lifts it up", () => {
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

    it("Resets all positions", () => {
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

      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });
  });

  context("Moving horizontally & slightly down - out form the right", () => {
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
            clientX: startingPointX + ((2 / 3) * elmBox.width + 2),
            clientY: startingPointY + 10,
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

    it("Resets all positions", () => {
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

      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });
  });

  context("Moving horizontally & slightly down - out form the left", () => {
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
            clientX: startingPointX - ((2 / 3) * elmBox.width + 2),
            clientY: startingPointY + 10,
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

    it("Resets all positions", () => {
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

      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });
  });

  context("Moving horizontally & slightly up - out form the right", () => {
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
            clientX: startingPointX + ((2 / 3) * elmBox.width + 2),
            clientY: startingPointY - 10,
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

    it("Resets all positions", () => {
      it("Does not effect (container3 |> elm-1)", () => {
        cy.get("#id-9").should("have.css", "transform", "none");
      });

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

      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });
  });

  context("Moving horizontally & slightly up - out form the left", () => {
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
            clientX: startingPointX - ((2 / 3) * elmBox.width + 2),
            clientY: startingPointY - 10,
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

    it("Resets all positions", () => {
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

      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });
  });
}

context("DnD/Testing is out position horizontally", () => {
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
});
