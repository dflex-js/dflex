context("Working with visibility, changing positions and continuity", () => {
  let elmBox: DOMRect;
  let startingPointX: number;
  // eslint-disable-next-line no-unused-vars
  let startingPointY: number;

  let stepsX = 0;
  let stepsY = 0;

  before(() => {
    cy.visit("http://localhost:3001/extended");
  });

  it("Getting the first element (1)", () => {
    cy.get("#1-extended").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#1-extended").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (1) - outside the list", () => {
    stepsX = 240;

    for (let i = 0; i <= stepsX; i += 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }

    stepsY = 110;
    for (let i = 0; i <= stepsY; i += 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
  });

  it("Insert element (1) inside the list", () => {
    for (let i = stepsX; i >= 0; i -= 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
    stepsX = 0;
  });

  it("Splitting the list after 2 and 3", () => {
    cy.get(`#2-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -59.1875)"
    );

    cy.get(`#3-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -59.1875)"
    );
  });

  it("The Splitting changes the index dataset", () => {
    cy.get(`#2-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`0`);
    });

    cy.get(`#3-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`1`);
    });

    cy.get(`#1-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`2`);
    });
  });

  it("Triggers mouseup", () => {
    cy.get("#1-extended").trigger("mouseup", { force: true });
  });

  it("Checking list new positions", () => {
    cy.get(`#1-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 118.375)"
    );

    cy.get(`#2-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -59.1875)"
    );

    cy.get(`#3-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -59.1875)"
    );
  });

  it("List has new order", () => {
    cy.get(`#2-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`0`);
    });

    cy.get(`#3-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`1`);
    });

    cy.get(`#1-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`2`);
    });
  });

  it("Non-visible elements don't have any transformation", () => {
    for (let i = 14; i < 100; i += 10) {
      cy.get(`#${i}-extended`).should("have.css", "transform", "none");
    }
  });

  it("Getting the third element (1-extended) - Chekiang just clicking", () => {
    cy.get("#1-extended").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#1-extended").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Triggers mouseup", () => {
    cy.get("#1-extended").trigger("mouseup", { force: true });
  });

  it("Nothing change in the list by just clicking", () => {
    cy.get(`#1-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 118.375)"
    );

    cy.get(`#2-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -59.1875)"
    );

    cy.get(`#3-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -59.1875)"
    );

    cy.get(`#2-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`0`);
    });

    cy.get(`#3-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`1`);
    });

    cy.get(`#1-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`2`);
    });
  });

  it("Getting the third element (1-extended) - Chekiang continuity", () => {
    cy.get("#1-extended").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      // eslint-disable-next-line no-unused-vars
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#1-extended").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms element (1) - outside the list", () => {
    stepsX = 240;

    for (let i = 0; i <= stepsX; i += 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }

    stepsY = 260;
    for (let i = 0; i <= stepsY; i += 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
  });

  it("Insert element (1) inside the list", () => {
    for (let i = stepsX; i >= 0; i -= 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }
    stepsX = 0;
  });

  it("Splitting the list at 6", () => {
    for (let i = 2; i < 6; i += 1) {
      cy.get(`#${i}-extended`).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -59.1875)"
      );
    }
  });

  it("Transom element down", () => {
    stepsY = 620;

    for (let i = 260; i <= stepsY; i += 10) {
      cy.get("#1-extended").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0);
    }

    stepsX = 0;
  });

  it("Triggers mouseup", () => {
    cy.get("#1-extended").trigger("mouseup", { force: true });
  });

  it("Siblings order dataset is updated now", () => {
    for (let i = 2; i < 12; i += 1) {
      cy.get(`#${i}-extended`).then((elm) => {
        const { index } = elm[0].dataset;
        expect(index).to.be.eq(`${i - 2}`);
      });
    }
    cy.get(`#1-extended`).then((elm) => {
      const { index } = elm[0].dataset;
      expect(index).to.be.eq(`10`);
    });
  });

  it("Siblings have new positions", () => {
    for (let i = 2; i < 12; i += 1) {
      cy.get(`#${i}-extended`).should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -59.1875)"
      );
    }

    cy.get(`#1-extended`).should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 591.875)"
    );
  });

  it("Non-visible elements don't have any transformation", () => {
    for (let i = 16; i < 100; i += 10) {
      cy.get(`#${i}-extended`).should("have.css", "transform", "none");
    }
  });
});
