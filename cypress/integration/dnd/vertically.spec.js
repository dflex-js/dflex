let startingPointX;
let startingPointY;
let elmBox;

context("DnD/Testing is out vertically", () => {
  before(() => {
    cy.visit("http://localhost:3001/");
  });

  context.skip("Moving strict vertically - out down", () => {
    it("Transforms element 10 out", () => {
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

      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });
  });
});
