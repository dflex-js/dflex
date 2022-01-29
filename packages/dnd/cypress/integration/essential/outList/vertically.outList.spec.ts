function myContextH() {
  let startingPointX: number;
  let startingPointY: number;
  let elmBox: DOMRect;

  let step = 0;

  context("Moving first element down outside the list", () => {
    it("Transforms (container3 |> elm-1) out, one position", () => {
      cy.get("#id-9").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        step = (2 / 3) * elmBox.height + 2;

        cy.get("#id-9")
          .trigger("mousedown", {
            button: 0,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + step,
            force: true,
          });
      });
    });

    it("Transforms to the end of the list", () => {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + 2 * step,
        force: true,
      });

      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + 3 * step,
        force: true,
      });

      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + 4 * step,
        force: true,
      });

      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + 5 * step,
        force: true,
      });
    });

    it("Transforms out the list", () => {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + 6 * step,
        force: true,
      });

      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + 7 * step,
        force: true,
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
  });

  context("Moving element up, outside the list - again", () => {
    it("Transforms to the top of the list", () => {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + 6 * step,
        force: true,
      });

      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + 5 * step,
        force: true,
      });

      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + 4 * step,
        force: true,
      });

      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + 3 * step,
        force: true,
      });

      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + 2 * step,
        force: true,
      });

      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + step,
        force: true,
      });

      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY,
        force: true,
      });
    });

    it("Siblings all back to positions", () => {
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

    it("Transforms (container3 |> elm-1) out the list", () => {
      cy.get("#id-9").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY - step - 35,
        force: true,
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
  });

  context("End motion, reset all", () => {
    it("triggers mouse up", () => {
      cy.get("#id-9").trigger("mouseup", { force: true });
    });

    it("Siblings all back to positions", () => {
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
}

context("DnD/Testing is out the list vertically: out down/in/out up", () => {
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

      myContextH();
    });
  });
});
