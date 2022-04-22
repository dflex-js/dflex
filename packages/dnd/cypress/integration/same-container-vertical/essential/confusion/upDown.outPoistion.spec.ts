context("Moving and returning from the same position", () => {
  let elmBox: DOMRect;
  let startingPointX: number;
  let startingPointY: number;

  // let steps: number;

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
    for (let i = 0; i < elmBox.height + 2; i += 10) {
      cy.get("#id-9").trigger("mousemove", {
        clientY: startingPointY - (elmBox.height + 2) + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Transforms (container3 |> elm-1) in to the original X-position", () => {
    for (let i = 0; i < elmBox.width + 2; i += 10) {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX - (elmBox.width + 2) + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
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

context("Swinging - Confusion starts from up/down", () => {
  let elmBox: DOMRect;
  let startingPointX: number;
  let startingPointY: number;

  let steps: number;

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
    // steps = elmBox.height + 2 + 180;
    steps = elmBox.height + 2 + 22;

    for (let i = 0; i < steps; i += 10) {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX - (elmBox.width - i),
        clientY: startingPointY - (elmBox.height + 2) + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Checking the stability of the new positions", () => {
    cy.get("#id-10").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
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

  it("Continue movement", () => {
    for (let i = steps; i < steps + 120; i += 10) {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX - (elmBox.width - i),
        clientY: startingPointY - (elmBox.height + 2) + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    steps += 120;
  });

  it("Checking the stability of the new positions", () => {
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

  it("Continue movement", () => {
    for (let i = steps; i < steps + 20; i += 5) {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX - (elmBox.width - i),
        clientY: startingPointY - (elmBox.height + 2) + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    steps += 20;
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

context("Testing continuity", () => {
  let elmBox: DOMRect;
  let startingPointX: number;
  let startingPointY: number;

  // let steps: number;

  it("Initiates location", () => {
    cy.get("#id-9").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#id-9").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms (container3 |> elm-1) up", () => {
    for (let i = 0; i < 35; i += 1) {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX - i,
        clientY: startingPointY - i,

        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
  });

  it("Triggers mouseup", () => {
    cy.get("#id-9").trigger("mouseup", { force: true });
  });

  it("Checking the stability of the new positions", () => {
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

    cy.get("#id-12").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)"
    );
  });
});
