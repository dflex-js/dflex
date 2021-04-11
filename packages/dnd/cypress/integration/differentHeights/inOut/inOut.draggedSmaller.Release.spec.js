let elmBox;
let startingPointX;
let startingPointY;

let stepsX = 0;
let stepsY = 0;

context(
  "Moving Elements In/Out (Insertion) - Dragged is smaller - Release the dragged",
  () => {
    before(() => {
      cy.visit("http://localhost:3001/todo");
    });

    it("Getting the first element (mtg)", () => {
      cy.get("#mtg").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        // eslint-disable-next-line no-unused-vars
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#mtg").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (mtg) - outside the list", () => {
      stepsX = 240;
      for (let i = 0; i < stepsX; i += 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientX: startingPointX - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }

      stepsY = 155;
      for (let i = 0; i < stepsY; i += 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("All siblings are lifted up", () => {
      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );
    });

    it("Insert element (mtg) inside - Occupy #proj", () => {
      for (let i = stepsX; i >= 0; i -= 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientX: startingPointX - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Triggers mouseup", () => {
      cy.get("#mtg").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 171.188)"
      );

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
    });

    it("Getting the element (mtg)", () => {
      cy.get("#mtg").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#mtg").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms out one step", () => {
      // steps = elmBox.height + 2 + 180;
      stepsX = 190;

      for (let i = 0; i < stepsX; i += 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientX: startingPointX - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }

      stepsY = 150;
      for (let i = 0; i < stepsY; i += 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientY: startingPointY + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Insert element (mtg) inside - Occupy #gym", () => {
      for (let i = stepsX; i >= 0; i -= 1) {
        cy.get("#mtg").trigger("mousemove", {
          clientX: startingPointX - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }

      stepsX = 0;
      stepsY = 0;
    });

    it("Triggers mouseup", () => {
      cy.get("#mtg").trigger("mouseup", { force: true });
    });

    it("Siblings have new positions", () => {
      cy.get("#mtg").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 457.562)"
      );

      cy.get("#org").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#proj").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );

      cy.get("#gym").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -115.188)"
      );
    });
  }
);
