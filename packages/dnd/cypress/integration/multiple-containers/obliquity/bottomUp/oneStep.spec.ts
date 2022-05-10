context("Split one container form bottom up", () => {
  before(() => {
    cy.visit("http://localhost:3001/migration");
  });

  let elmBox: DOMRect;
  let startingPointX: number;
  let startingPointY: number;

  // const stepsX = 0;
  let stepsY = 0;

  it("Getting the first element from container-3", () => {
    cy.get("#c2-3").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#c2-3").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (#c2-3) into containers-1", () => {
    stepsY = 130;
    for (let i = 0; i < stepsY; i += 10) {
      cy.get("#c2-3").trigger("mousemove", {
        clientY: startingPointY - i,
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
  });

  it("Triggers mouseup event", () => {
    cy.get("#c2-3").trigger("mouseup", { force: true });
  });
});
