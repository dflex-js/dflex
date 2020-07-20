jest.setTimeout(30000);

describe("Essential", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3001");
  });

  it("should work", async (done) => {
    const elm = await page.waitForSelector("#id-10");
    const elmBox = await elm.boundingBox();
    page.setViewport({ width: 900, height: 720 });

    await page.mouse.move(10, 20);
    await page.mouse.down();
    await page.mouse.move(100, 10);
    await page.mouse.up();
    done();
  });
});
