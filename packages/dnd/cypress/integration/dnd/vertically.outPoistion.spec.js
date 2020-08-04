let startingPointX;
let startingPointY;
let elmBox;

context("DnD/Testing is out position vertically", () => {
  before(() => {
    cy.visit("http://localhost:3001/");
  });

  context("Moving strict vertically one siblings - out down", () => {
    it("Transforms element 10 out", () => {
      console.log("===============");

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

    it("Does not effect element 9", () => {
      cy.get("#id-9").should("have.css", "transform", "none");
    });

    it("Effects element 11, lifts it up", () => {
      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Does not effect element 12", () => {
      cy.get("#id-12").should("have.css", "transform", "none");
    });

    it("Triggers mouseup", () => {
      cy.get("#id-10").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#p0-1c")
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

      cy.get("#id-12").should("have.css", "transform", "none");
    });
  });

  context("Moving strict vertically one siblings - out up", () => {
    it("Transforms element 10 out", () => {
      console.log("===============");

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

    it("Effects element 9, moves it down", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 58)"
      );
    });

    it("Does not effect element 11", () => {
      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });

    it("Does not effect element 12", () => {
      cy.get("#id-12").should("have.css", "transform", "none");
    });

    it("Triggers mouseup", () => {
      cy.get("#id-10").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#p0-1c")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(4);
        });
    });

    it("Resets all positions", () => {
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

      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#id-12").should("have.css", "transform", "none");
    });
  });

  context("Moving strict vertically multi siblings - out down", () => {
    it("Transforms element 10 out", () => {
      console.log("===============");
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

    it("Does not effect element 9", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });

    it("Effects element 11, lifts it up", () => {
      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Effects element 12, lifts it up", () => {
      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Moves outside the parent", () => {
      cy.get("#id-10").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + (2 * elmBox.height + 2 * elmBox.height),
        force: true,
      });
    });

    it("Triggers mouseup", () => {
      cy.get("#id-10").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#p0-1c")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(4);
        });
    });

    it("Resets all positions", () => {
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
});
