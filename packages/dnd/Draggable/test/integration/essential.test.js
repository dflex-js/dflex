jest.setTimeout(30000);

describe("Essential", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3001");
  });

  it("should work", async (done) => {
    const elm = await page.waitForSelector("#id-10");
    const elmBox = await elm.boundingBox();
    await page.mouse.move(0, 0);
    await page.mouse.down();
    await page.mouse.move(100, 10);
    await page.mouse.up();
    done();
  });
});
