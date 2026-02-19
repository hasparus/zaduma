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
    await ensureFontsLoaded(page);

    await expect(page).toHaveScreenshot("index.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.04,
    });
  });

  test("blog posts match screenshots", async ({ page }) => {
    test.setTimeout(60_000);
    for (const post of postsInFS) {
      await page.goto(`/${post}`);
      await ensureFontsLoaded(page);

      await expect(page).toHaveScreenshot(`${post.replace(/\//g, "-")}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.04,
      });
    }
  });
});

async function ensureFontsLoaded(page: Page) {
  await page.evaluate(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  });
  
  await page.waitForLoadState("networkidle");
  
  await page.evaluate(async () => {
    await document.fonts.ready;
    
    const fontsToLoad = [
      '16px "Inter"',
      '16px "Brygada 1918"',
      'italic 16px "Brygada 1918"',
      '16px "Fira Code"',
    ];
    
    const loadPromises = fontsToLoad.map(fontSpec => 
      document.fonts.load(fontSpec).catch(() => null)
    );
    
    await Promise.all(loadPromises);
    
    await new Promise(resolve => setTimeout(resolve, 500));
  });
  
  await page.waitForTimeout(200);
}
