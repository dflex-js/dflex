jest.setTimeout(30000);

let startingPointX;
let startingPointY;
let elmBox;

describe("Essential", () => {
  beforeEach(async () => {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto("http://localhost:3001");

    const elm = await page.waitForSelector("#id-10");
    elmBox = await elm.boundingBox();

    startingPointX = elmBox.x + elmBox.width / 2;
    startingPointY = elmBox.y + elmBox.height / 2;
  });

  describe("Absolute Horizontal", () => {
    it("Goes out from left", async () => {
      await page.mouse.move(startingPointX, startingPointY);
      await page.mouse.down();
      await page.mouse.move(
        startingPointX + ((2 / 3) * elmBox.width + 200),
        startingPointY
      );
      await jestPuppeteer.debug();
      // await page.mouse.up();
      // done();
    });

    // it("Goes out from right", async (done) => {
    //   await page.mouse.move(startingPointX, startingPointY);
    //   await page.mouse.down();
    //   await page.mouse.move(startingPointX, 1000);
    //   await page.mouse.up();
    //   done();
    // });
  });
});
