import { toMatchImageSnapshot } from "jest-image-snapshot";
import puppeteer, { type Browser, Page } from "puppeteer";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const HEADLESS = true;

expect.extend({ toMatchImageSnapshot });

/**
 * We're doing visual testing in a blog starter to ensure
 * that version updates don't break anything.
 */
describe("visual regression", async () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: HEADLESS,
    });
    page = await browser.newPage();
  });

  it("should match the snapshot", async () => {
    await page.goto("http://localhost:4321");
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });

  afterAll(async () => {
    await browser.close();
  });
});

declare module "vitest" {
  interface Assertion<T> {
    toMatchImageSnapshot: () => T;
  }
}
