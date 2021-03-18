let elmBox;
let startingPointX;
let startingPointY;

let steps;

const waitingTime = Cypress.env("extended") ? 0 : 6;
console.log(
  "file: generic.outPoistion.spec.js ~ line 8 ~ waitingTime",
  waitingTime
);

context("Moving and returning from the same position", () => {
  before(() => {
    cy.visit("http://localhost:3001");
  });

  it("Transforms (container3 |> elm-1) out", () => {
    cy.get("#id-9").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#id-9")
        .trigger("mousedown", {
          button: 0,
        })
        .trigger("mousemove", {
          clientX: startingPointX - (elmBox.width + 2),
          clientY: startingPointY - (elmBox.height + 2),
          force: true,
        });
    });
  });

  it("Transforms (container3 |> elm-1) in to the original Y-position", () => {
    for (let i = 0; i < elmBox.height + 2; i += 1) {
      cy.get("#id-9").trigger("mousemove", {
        clientY: startingPointY - (elmBox.height + 2) + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(waitingTime);
    }
  });

  it("Transforms (container3 |> elm-1) in to the original X-position", () => {
    for (let i = 0; i < elmBox.width + 2; i += 1) {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX - (elmBox.width + 2) + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(waitingTime);
    }
  });

  it("Triggers mouseup", () => {
    cy.get("#id-9").trigger("mouseup", { force: true });
  });

  it("All list holds the right position", () => {
    cy.get("#id-9").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");

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

context("Swinging - Confusion", () => {
  before(() => {
    cy.visit("http://localhost:3001");
  });

  it("Transforms (container3 |> elm-1) out", () => {
    cy.get("#id-9").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#id-9")
        .trigger("mousedown", {
          button: 0,
        })
        .trigger("mousemove", {
          clientX: startingPointX - (elmBox.width + 2),
          clientY: startingPointY - (elmBox.height + 2),
          force: true,
        });
    });
  });

  it("Transforms (container3 |> elm-1) in threshold confusion", () => {
    steps = elmBox.height + 2 + 180;

    for (let i = 0; i < steps; i += 1) {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX - (elmBox.width - i),
        clientY: startingPointY - (elmBox.height + 2) + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(waitingTime);
    }
  });

  it("Triggers mouseup", () => {
    cy.get("#id-9").trigger("mouseup", { force: true });
  });

  it("Checking new positions", () => {
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
