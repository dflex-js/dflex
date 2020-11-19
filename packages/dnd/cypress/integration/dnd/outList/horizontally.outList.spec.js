let startingPointX;
let startingPointY;
let elmBox;

let stepX;

context("DnD/Testing is out the list horizontally", () => {
  before(() => {
    cy.visit("http://localhost:3001/");
  });

  context("Moving first element right outside the list", () => {
    it("Transforms element 9 out", () => {
      cy.get("#id-9").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        stepX = (2 / 3) * elmBox.width + 2;

        cy.get("#id-9")
          .trigger("mousedown", {
            button: 0,
          })
          .trigger("mousemove", {
            clientX: startingPointX + stepX,
            clientY: startingPointY,
            force: true,
          });
      });
    });

    it("Siblings all lifted up", () => {
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

    it("Continue transformation, keeps siblings up", () => {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX + 2 * stepX,
        clientY: startingPointY,
        force: true,
      });

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

  context("Moving element down", () => {
    it("Moves element down", () => {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX + 2 * stepX,
        clientY: startingPointY * 2,
        force: true,
      });
    });
  });
});
