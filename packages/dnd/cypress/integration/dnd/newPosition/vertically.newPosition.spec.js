let startingPointX;
let startingPointY;
let elmBox;

context("DnD/Testing occupying multiple positions vertically", () => {
  before(() => {
    cy.visit("http://localhost:3001/");
  });

  context("Moving down", () => {
    it("Transforms element 10 out", () => {
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
            clientY: startingPointY + ((3 / 3) * elmBox.height + 8),
            force: true,
          });
      });
    });

    it("Does not effect element 11", () => {
      cy.get("#id-11").should("have.css", "transform", "none");
    });

    it("Does not effect element 12", () => {
      cy.get("#id-12").should("have.css", "transform", "none");
    });

    it("Triggers mouseup", () => {
      cy.get("#id-9").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#p0-1c")
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
  });
});
