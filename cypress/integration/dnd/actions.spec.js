// / <reference types="cypress" />

let startingPointX;
let startingPointY;
let elmBox;

context("DnD/Testing is out", () => {
  before(() => {
    cy.visit("http://localhost:3001/");
  });

  context("Moving horizontally- out form the right", () => {
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
            clientX: startingPointX + ((2 / 3) * elmBox.width + 2),
            clientY: startingPointY,
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

    it("Triggers mouseup", () => {
      cy.get("#id-10").trigger("mouseup", { force: true });
    });

    it("Makes sure list has three elements", () => {
      cy.get("#p0-1c")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(3);
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
    });
  });

  context("Moving horizontally- out form the left", () => {
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
            clientX: startingPointX - ((2 / 3) * elmBox.width + 2),
            clientY: startingPointY,
            force: true,
          });
      });
    });

    it("Does not effect element 9", () => {
      cy.get("#id-9").should("have.css", "transform", "none");
    });

    it("Effects another element, lowers the up", () => {
      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Triggers mouseup", () => {
      cy.get("#id-10").trigger("mouseup", { force: true });
    });

    it("Makes sure list has three elements", () => {
      cy.get("#p0-1c")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(3);
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
    });
  });
});
