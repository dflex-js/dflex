let startingPointX;
let startingPointY;
let elmBox;

context("DnD/Testing occupying multiple positions vertically down", () => {
  before(() => {
    cy.visit("http://localhost:3001/");
  });

  context("Moving element 9 down to occupy 10 position", () => {
    it("Transforms element 10 out", () => {
      cy.get("#id-9").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();

        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#id-9")
          .trigger("mousedown", {
            button: 0,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + ((1 / 3) * elmBox.height + 8),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + ((2 / 3) * elmBox.height + 8),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + ((3 / 3) * elmBox.height + 8),
            force: true,
          });
      });
    });

    it("Does not effect element 11", () => {
      cy.get("#id-11").should("have.css", "transform", "none");
    });

    it("Does not effect element 12", () => {
      cy.get("#id-12").should("have.css", "transform", "none");
    });

    it("Triggers mouseup", () => {
      cy.get("#id-9").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#p0-1c")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(4);
        });
    });

    it("All elements preserve their positions", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 58)"
      );

      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );

      cy.get("#id-11").should("have.css", "transform", "none");

      cy.get("#id-12").should("have.css", "transform", "none");
    });
  });

  context("Moving element 9 down to occupy 11 position", () => {
    it("Transforms element 10 out", () => {
      cy.get("#id-9").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();

        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#id-9")
          .trigger("mousedown", {
            button: 0,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + ((1 / 3) * elmBox.height + 8),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + ((2 / 3) * elmBox.height + 8),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + ((3 / 3) * elmBox.height + 8),
            force: true,
          });
      });
    });

    it("Does not effect element 10", () => {
      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Effects element 11, lifts it up", () => {
      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Does not effect element 12", () => {
      cy.get("#id-12").should("have.css", "transform", "none");
    });

    it("Triggers mouseup", () => {
      cy.get("#id-9").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#p0-1c")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(4);
        });
    });

    it("All elements preserve their positions", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 116)"
      );

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

      cy.get("#id-12").should("have.css", "transform", "none");
    });
  });

  context("Moving element 9 down to occupy 12 position", () => {
    it("Transforms element 10 out", () => {
      cy.get("#id-9").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();

        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#id-9")
          .trigger("mousedown", {
            button: 0,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + ((1 / 3) * elmBox.height + 8),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + ((2 / 3) * elmBox.height + 8),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + ((3 / 3) * elmBox.height + 8),
            force: true,
          });
      });
    });

    it("Does not effect element 10", () => {
      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Does not effect element 11", () => {
      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Effect element 12, lifts it up", () => {
      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Triggers mouseup", () => {
      cy.get("#id-9").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#p0-1c")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(4);
        });
    });

    it("All elements preserve their positions", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 174)"
      );

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

  context("Moving element 10 down, to occupy 11 position", () => {
    it("Transforms element 10 out", () => {
      cy.get("#id-10").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();

        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#id-10")
          .trigger("mousedown", {
            button: 0,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + ((1 / 3) * elmBox.height + 8),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + ((2 / 3) * elmBox.height + 8),
            force: true,
          })
          .trigger("mousemove", {
            clientX: startingPointX,
            clientY: startingPointY + ((3 / 3) * elmBox.height + 8),
            force: true,
          });
      });
    });

    it("Effects element 11, lifts it up", () => {
      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -116)"
      );
    });

    it("Does not effect element 12", () => {
      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });

    it("Does not effect element 9", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 174)"
      );
    });

    it("Triggers mouseup", () => {
      cy.get("#id-9").trigger("mouseup", { force: true });
    });

    it("Makes sure list has four elements", () => {
      cy.get("#p0-1c")
        .should("not.be.empty")
        .and(($li) => {
          expect($li[0].children).to.have.length(4);
        });
    });

    it("All elements preserve their positions", () => {
      cy.get("#id-9").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 174)"
      );

      cy.get("#id-10").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );

      cy.get("#id-11").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -116)"
      );

      cy.get("#id-12").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, -58)"
      );
    });
  });
});

context("DnD/Testing occupying multiple positions vertically up", () => {
  it("Transforms element 9 out - one sibling to 12", () => {
    console.log("=======");
    cy.get("#id-9").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();

      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#id-9")
        .trigger("mousedown", {
          button: 0,
        })
        .trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY - ((1 / 3) * elmBox.height + 8),
          force: true,
        })
        .trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY - ((2 / 3) * elmBox.height + 8),
          force: true,
        })
        .trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY - ((3 / 3) * elmBox.height + 8),
          force: true,
        });
    });
  });

  it("Transforms element 9 out - two siblings to 10", () => {
    cy.get("#id-9")
      .trigger("mousemove", {
        clientX: startingPointX,
        clientY:
          startingPointY -
          ((1 / 3) * elmBox.height + (3 / 3) * elmBox.height + 8),
        force: true,
      })
      .trigger("mousemove", {
        clientX: startingPointX,
        clientY:
          startingPointY -
          ((2 / 3) * elmBox.height + (3 / 3) * elmBox.height + 2 * 8),
        force: true,
      })
      .trigger("mousemove", {
        clientX: startingPointX,
        clientY:
          startingPointY -
          ((3 / 3) * elmBox.height + (3 / 3) * elmBox.height + 2 * 8),
        force: true,
      });
  });

  it("Triggers mouseup", () => {
    cy.get("#id-9").trigger("mouseup", { force: true });
  });

  it("Makes sure list has four elements", () => {
    cy.get("#p0-1c")
      .should("not.be.empty")
      .and(($li) => {
        expect($li[0].children).to.have.length(4);
      });
  });

  it("Does not effect element 11", () => {
    cy.get("#id-11").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -116)"
    );
  });

  it("Puts element 9 in a new position ", () => {
    cy.get("#id-9").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );
  });

  it("Puts element 10 in a new position ", () => {
    cy.get("#id-10").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 58)"
    );
  });

  it("Puts element 12 in a new position ", () => {
    cy.get("#id-12").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)"
    );
  });

  it("Moves element 11 outside the parent", () => {
    cy.get("#id-11").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();

      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#id-11")
        .trigger("mousedown", {
          button: 0,
        })
        .trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY - ((1 / 3) * elmBox.height + 8),
          force: true,
        })
        .trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY - ((2 / 3) * elmBox.height + 8),
          force: true,
        })
        .trigger("mousemove", {
          clientX: startingPointX,
          clientY: startingPointY - ((3 / 3) * elmBox.height + 8),
          force: true,
        });
    });
  });

  it("Lifts all siblings up", () => {
    cy.get("#id-9").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");

    cy.get("#id-10").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)"
    );

    cy.get("#id-12").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );
  });

  it("Triggers mouseup", () => {
    cy.get("#id-11").trigger("mouseup", { force: true });
  });

  it("Makes sure list has four elements", () => {
    cy.get("#p0-1c")
      .should("not.be.empty")
      .and(($li) => {
        expect($li[0].children).to.have.length(4);
      });
  });

  it("Resets all elements positions", () => {
    cy.get("#id-11").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -116)"
    );

    // cy.get("#id-9").should(
    //   "have.css",
    //   "transform",
    //   "matrix(1, 0, 0, 1, 0, 58)"
    // );

    // cy.get("#id-10").should(
    //   "have.css",
    //   "transform",
    //   "matrix(1, 0, 0, 1, 0, 58)"
    // );

    cy.get("#id-12").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)"
    );
  });
});
