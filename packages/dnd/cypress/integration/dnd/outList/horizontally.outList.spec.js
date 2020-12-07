let startingPointX;
let startingPointY;
let elmBox;

let stepX;
let stepY;

let newPositionY;
let newPositionX;

const AllUP = () => {
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
};

context(
  "DnD/Testing is out the list horizontally: out right/down/in left",
  () => {
    before(() => {
      cy.visit("http://localhost:3001/");
    });

    context("Moving first element right outside the list", () => {
      it("Transforms (container3 |> elm-1) out horizontally", () => {
        cy.get("#id-9").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          stepX = (2 / 3) * elmBox.width + 2;
          stepY = (2 / 3) * elmBox.height + 2;

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
        AllUP();
      });

      it("Continue transformation horizontally", () => {
        newPositionX = startingPointX + 2 * stepX;

        cy.get("#id-9").trigger("mousemove", {
          clientX: newPositionX,
          clientY: startingPointY,
          force: true,
        });
      });

      it("Siblings all lifted up", () => {
        AllUP();
      });
    });

    context("Entering new position", () => {
      it("Moves element down", () => {
        cy.get("#id-9").trigger("mousemove", {
          clientX: newPositionX,
          clientY: startingPointY + stepY,
          force: true,
        });

        newPositionY = startingPointY + 2 * stepY + 25;

        cy.get("#id-9").trigger("mousemove", {
          clientX: newPositionX,
          clientY: newPositionY,
          force: true,
        });
      });

      it("Moves element left", () => {
        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX + 1.5 * stepX,
          clientY: newPositionY,
          force: true,
        });

        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX + stepX,
          clientY: newPositionY,
          force: true,
        });

        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX,
          clientY: newPositionY,
          force: true,
        });
      });

      it("Splits the list in the entering breaking point", () => {
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
          "matrix(1, 0, 0, 1, 0, 0)"
        );
      });
    });

    context("Moves dragged down and makes new transformation", () => {
      it("Moving dragged down", () => {
        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX,
          clientY: newPositionY + 0.5 * stepX,
          force: true,
        });

        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX,
          clientY: newPositionY + 0.75 * stepX,
          force: true,
        });
      });

      it("Doesn't effect element above", () => {
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

        it("Lifts effected element up", () => {
          cy.get("#id-12").should(
            "have.css",
            "transform",
            "matrix(1, 0, 0, 1, 0, -58)"
          );
        });
      });
    });

    context("End transformation", () => {
      it("Triggers mouseup", () => {
        cy.get("#id-9").trigger("mouseup", { force: true });
      });

      it("Dragged takes new position in the end of the list", () => {
        cy.get("#id-9").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 174)"
        );
      });
    });
  }
);
