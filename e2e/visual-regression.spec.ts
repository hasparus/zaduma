import { test, expect } from "@playwright/test";
import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

let postsInFS: string[];

test.beforeAll(async () => {
  const files = await readdir(join(__dirname, "../posts"), { recursive: true });
  postsInFS = files
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, "").replaceAll(" ", "-"))
    .sort();
});

test.describe("Visual regression", () => {
  test("index page matches screenshot", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot("index.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("blog posts match screenshots", async ({ page }) => {
    test.setTimeout(60_000);
    for (const post of postsInFS) {
      await page.goto(`/${post}`);
      await expect(page).toHaveScreenshot(`${post.replace(/\//g, "-")}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      });
    }
  });
});
