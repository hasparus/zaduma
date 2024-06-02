import { toMatchImageSnapshot } from "jest-image-snapshot";
import { readdir } from "node:fs/promises";
import { getDocument, queries } from "pptr-testing-library";
import puppeteer, { type Browser, Page } from "puppeteer";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const HEADLESS = true;

expect.extend({ toMatchImageSnapshot });

let postsInFS = await readdir(new URL("../posts", import.meta.url).pathname, {
  recursive: true,
});
postsInFS = postsInFS
  .filter((file) => /\.mdx?$/.test(file))
  .map((file) => file.replace(/\.mdx?$/, ""))
  .sort();

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

  let postsInFS = await readdir(new URL("../posts", import.meta.url).pathname, {
    recursive: true,
  });
  postsInFS = postsInFS
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, "").replaceAll(" ", "-"));

  // the tests are ran in order with no file parallelism

  it("renders links to all posts on index page", async () => {
    await page.goto("http://localhost:4321");

    const document = await getDocument(page);
    const handles = await queries.getAllByRole(document, "link");

    const hrefs: string[] = [];
    for (const handle of handles) {
      const href = await handle.evaluate((el) => el.getAttribute("href"));
      if (href) {
        hrefs.push(href.replace(/^\//, ""));
      }
    }

    for (const post of postsInFS) {
      expect(hrefs).toContain(post);
    }
  });

  it("matches screenshot on index page", async () => {
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchImageSnapshot();
  });

  it("matches screenshots in blog posts", { timeout: 60_000 }, async () => {
    for (const post of postsInFS) {
      await page.goto(`http://localhost:4321/${post}`);
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toMatchImageSnapshot();
    }
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
