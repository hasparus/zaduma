import { test, expect, Page } from "@playwright/test";
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
    await ensurePageStable(page);

    await expect(page).toHaveScreenshot("index.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("blog posts match screenshots", async ({ page }) => {
    test.setTimeout(60_000);
    for (const post of postsInFS) {
      await page.goto(`/${post}`);
      await ensurePageStable(page);

      await expect(page).toHaveScreenshot(`${post.replace(/\//g, "-")}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    }
  });
});

/**
 * Settle the page so a fullPage screenshot has a stable height across runs:
 * scroll the full height to trigger lazy images, then wait for every image to
 * decode and the self-hosted fonts to load. Deliberately no remote webfont —
 * the site ships Inter + Brygada and falls back to system mono for code, so a
 * network font request would only add non-determinism (and per-platform
 * snapshots already cover the system-mono difference).
 */
async function ensurePageStable(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, y);
        y += window.innerHeight;
        if (y < document.body.scrollHeight) {
          requestAnimationFrame(step);
        } else {
          window.scrollTo(0, 0);
          requestAnimationFrame(() => resolve());
        }
      };
      step();
    });
  });

  await page.waitForLoadState("networkidle");

  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : img.decode().catch(() => undefined),
      ),
    );
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });

  await page.waitForTimeout(150);
}
