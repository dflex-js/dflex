/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
let startingPointX;
let startingPointY;
let elmBox;

let stepX;
let stepY;

function myContext() {
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

  URLs.forEach(({ url, desc }) => {
    context(desc, () => {
      before(() => {
        cy.visit(url);
      });

      myContext();
    });
  });
});
