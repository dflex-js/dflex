let startingPointX;
let startingPointY;
let elmBox;

let stepX;
let stepY;

function myContext() {
  function backToOriginalPosition() {
    cy.get("#id-1").trigger("mousemove", {
      clientX: startingPointX,
      clientY: startingPointY,
      force: true,
    });
  }

  context("Moving element outside the list horizontally", () => {
    it("Clicks on (container1 |> elm-1) ", () => {
      cy.get("#id-1").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        stepX = (2 / 3) * elmBox.width + 2;
        stepY = (2 / 3) * elmBox.height + 2;
      });

      cy.get("#id-1").trigger("mousedown", {
        button: 0,
      });
    });

    it("Moves element out list to the right", () => {
      cy.get("#id-1").trigger("mousemove", {
        clientX: startingPointX + stepX,
        clientY: startingPointY,
        force: true,
      });
    });

    it("Moves element out list to the left", () => {
      backToOriginalPosition();

      cy.get("#id-1").trigger("mousemove", {
        clientX: startingPointX - stepX,
        clientY: startingPointY,
        force: true,
      });

      backToOriginalPosition();
    });
  });

  context("Moving element outside the list vertically", () => {
    it("Moves element out list to the top", () => {
      cy.get("#id-1").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY - stepY,
        force: true,
      });

      backToOriginalPosition();
    });

    it("Moves element out list to the top", () => {
      cy.get("#id-1").trigger("mousemove", {
        clientX: startingPointX,
        clientY: startingPointY + stepY,
        force: true,
      });

      backToOriginalPosition();
    });
  });
  context("End transformation", () => {
    it("Triggers mouseup safely without errors", () => {
      cy.get("#id-1").trigger("mouseup", { force: true });
    });
  });
}

context("DnD/Testing singleton element - Draggable without siblings", () => {
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
