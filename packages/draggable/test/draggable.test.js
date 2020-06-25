// import { Container, Draggable } from "dflex-react-draggable/src/comp onents";

const path = require("path");

describe("app", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3000");
  });

  it("should display a react logo", async () => {
    page;
    console.log("page", page);
    await expect(page).toMatch("React");
  });
});
