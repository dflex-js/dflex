let startingPointX;
let startingPointY;
let elmBox;

// let stepX;
let stepY;

function myContext() {
  context(
    `Moving (container3 |> elm-1) down outside the list then moving it up`,
    () => {
      it("Clicks (container3 |> elm-1)", () => {
        cy.get("#id-9").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          // stepX = (2 / 3) * elmBox.width + 2;
          stepY = elmBox.height + 2;

          cy.get("#id-9").trigger("mousedown", {
            button: 0,
          });
        });
      });

      it("Moving (container3 |> elm-1) out down, one position switching with 10", () => {
        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY + stepY,
          force: true,
        });

        cy.get("#id-10").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, -58)"
        );
      });

      it("Moving (container3 |> elm-1) out down, one position switching with 11", () => {
        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY + 2 * stepY,
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
      });

      it("Moving (container3 |> elm-1) out down, one position switching with 12", () => {
        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY + 3 * stepY,
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

      it("Moving (container3 |> elm-1) out down, outside the list", () => {
        cy.get("#id-9").trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY + 5 * stepY,
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

      it("Moving (container3 |> elm-1) up, inside the list to replace 12", () => {
        for (let i = 0; i < 20; i += 5) {
          cy.get("#id-9").trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + (4 - i / 10) * stepY,
            force: true,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          // cy.wait(10);
        }

        cy.get("#id-12").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 0)"
        );
      });

      it("Triggers mouseup", () => {
        cy.get("#id-9").trigger("mouseup", { force: true });
      });

      it("Siblings hold positions", () => {
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

      it("dragged occupies new positions", () => {
        cy.get("#id-9").should(
          "have.css",
          "transform",
          "matrix(1, 0, 0, 1, 0, 116)"
        );
      });
    }
  );
}

context("DnD/Testing a collections new positions", () => {
  const URLs = [
    {
      url: "http://localhost:3001/",
      desc: "Testing Container Based Event",
    },
  ];

  if (Cypress.env("extended")) {
    URLs.push({
      url: "http://localhost:3001/component-based-event",
      desc: "Testing Component Based Event",
    });
  }

  URLs.forEach(({ url, desc }) => {
    context(desc, () => {
      before(() => {
        cy.visit(url);
      });

      myContext();
    });
  });
});
