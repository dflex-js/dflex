context("Split containers during transformation", () => {
  let elmBox: DOMRect;
  let startingPointX: number;
  let startingPointY: number;

  let stepsX = 0;
  let stepsY = 0;

  before(() => {
    cy.visit("http://localhost:3001/migration");
  });

  it("Getting the first element from container-1", () => {
    cy.get("#c3-1").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#c3-1").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (#c3-1) - outside the horizontally into container-1", () => {
    stepsX = 450;
    for (let i = 0; i < stepsX; i += 10) {
      cy.get("#c3-1").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }

    stepsY = 10;
    for (let i = stepsY; i >= 0; i -= 10) {
      cy.get("#c3-1").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
  });
});
