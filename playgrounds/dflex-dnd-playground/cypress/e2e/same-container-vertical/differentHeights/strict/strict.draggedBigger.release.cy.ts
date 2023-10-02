context(
  "Moving Elements Strict - Dragged is bigger - Releasing the dragged",
  () => {
    let elmBox: DOMRect;
    let startingPointX: number;
    let startingPointY: number;

    let firstElmRect: DOMRect;
    let lastElmRect: DOMRect;

    let stepsX = 0;
    let stepsY = 0;

    before(() => {
      cy.visit("http://localhost:3001/todo");
    });

    it("Getting first and last elements rect", () => {
      cy.get("#mtg").then((elm) => {
        firstElmRect = elm[0].getBoundingClientRect();
      });

      cy.get("#gym").then((elm) => {
        lastElmRect = elm[0].getBoundingClientRect();
      });
    });

    it("Getting the second element (org)", () => {
      cy.get("#org").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#org").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (org) - one step", () => {
      stepsY = 155;

      for (let i = 0; i < stepsY; i += 10) {
        cy.get("#org").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#org").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should("have.css", "transform", "none");

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 147.188)",
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -171.188)",
      );

      cy.get("#gym").should("have.css", "transform", "none");
    });

    it("Getting the second element (org)", () => {
      cy.get("#org").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#org").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (org) - Occupy #gym", () => {
      stepsY = 155;

      for (let i = 0; i < stepsY; i += 10) {
        cy.get("#org").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#org").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should("have.css", "transform", "none");

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 286.375)",
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -171.188)",
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -171.188)",
      );
    });

    it("Getting the last element (org)", () => {
      cy.get("#org").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#org").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (org) up to occupy gym", () => {
      stepsY = 155;

      for (let i = 0; i < stepsY; i += 10) {
        cy.get("#org").trigger("mousemove", {
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#org").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should("have.css", "transform", "none");

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 147.188)",
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -171.188)",
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );
    });

    it("Getting the third element (org)", () => {
      cy.get("#org").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#org").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (org) up to occupy #prog", () => {
      stepsY = 155;

      for (let i = 0; i < stepsY; i += 10) {
        cy.get("#org").trigger("mousemove", {
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#org").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should("have.css", "transform", "none");

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );
    });

    it("Getting the second element (org)", () => {
      cy.get("#org").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#org").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (org) up to occupy the first position", () => {
      stepsY = 155;

      for (let i = 0; i < stepsY; i += 10) {
        cy.get("#org").trigger("mousemove", {
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#org").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 171.188)",
      );

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)",
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );
    });

    it("Getting the first element (org)", () => {
      cy.get("#org").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // eslint-disable-next-line no-unused-vars
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#org").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element outside the list", () => {
      stepsX = 200;

      for (let i = 0; i < stepsX; i += 10) {
        cy.get("#org").trigger("mousemove", {
          clientX: startingPointX + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("All siblings are lifted", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -171.188)",
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -171.188)",
      );
    });

    it("Triggers mouseup", () => {
      cy.get("#org").trigger("mouseup", { force: true });
    });

    it("Siblings go back to their positions", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 171.188)",
      );

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)",
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );
    });

    it("No layout shift happens to the list", () => {
      cy.get("#org").then((elm) => {
        const elmRect1 = elm[0].getBoundingClientRect();

        expect(elmRect1.x).to.equal(firstElmRect.x);
        expect(elmRect1.y).to.equal(firstElmRect.y);
      });

      cy.get("#gym").then((elm) => {
        const elmRect2 = elm[0].getBoundingClientRect();

        expect(elmRect2.x).to.equal(lastElmRect.x);
        expect(elmRect2.bottom).to.equal(lastElmRect.bottom);
      });
    });
  },
);
