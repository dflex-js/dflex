context("DnD/Testing orphan element - Draggable without parent", () => {
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

  function myContext() {
    let startingPointX: number;
    let startingPointY: number;
    let elmBox: DOMRect;

    let stepX = 0;
    let stepY = 0;

    context("Moving container horizontally and vertically", () => {
      it("Clicks on (container1)", () => {
        cy.get("#id-p1").then((elm) => {
          elmBox = elm[0].getBoundingClientRect();
          startingPointX = elmBox.x + elmBox.width / 2;
          startingPointY = elmBox.y + elmBox.height / 2;

          stepX = (2 / 3) * elmBox.width + 2;
          stepY = (2 / 3) * elmBox.height + 2;
        });

        cy.get("#id-p1").trigger("mousedown", "top", {
          button: 0,
        });
      });

      it("Moves (container1)", () => {
        cy.get("ul#id-p1").trigger("mousemove", {
          clientX: startingPointX + stepX,
          clientY: startingPointY + stepY,
          force: true,
        });
      });
    });

    context("End transformation", () => {
      it("Triggers mouseup safely without errors", () => {
        cy.get("#id-p1").trigger("mouseup", { force: true });
      });
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
