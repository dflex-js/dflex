context("Transforming into different container", () => {
  let elmBox: DOMRect;
  let startingPointX: number;
  let startingPointY: number;

  let stepsX = 0;
  let stepsY = 0;

  before(() => {
    cy.visit("http://localhost:3001/migration");
  });

  it("Getting the first element from orphan container", () => {
    cy.get("#c1-1").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#c1-1").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (#c1-1) - outside the list above container-2", () => {
    stepsY = 110;
    for (let i = 0; i < stepsY; i += 10) {
      cy.get("#c1-1").trigger("mousemove", {
        clientY: startingPointY - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }

    stepsX = 230;
    for (let i = 0; i < stepsX; i += 10) {
      cy.get("#c1-1").trigger("mousemove", {
        clientX: startingPointX + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
  });
});
