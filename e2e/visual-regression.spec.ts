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
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: geometricPrecision !important;
      }
    `;
    document.head.appendChild(style);
  });
  
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
    
    await Promise.all(
      fontsToLoad.map(fontSpec => document.fonts.load(fontSpec).catch(() => null))
    );
    
    const waitForFontsReady = async () => {
      for (let i = 0; i < 50; i++) {
        const allLoaded = fontsToLoad.every(fontSpec => document.fonts.check(fontSpec));
        if (allLoaded) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    };
    
    await waitForFontsReady();
    
    const verifyFontsInUse = () => {
      const testElements = Array.from(document.querySelectorAll('p, h1, h2, h3')).slice(0, 10);
      if (testElements.length === 0) return true;
      
      let interFound = false;
      let brygadaFound = false;
      
      for (const el of testElements) {
        const style = window.getComputedStyle(el);
        const fontFamily = style.fontFamily.toLowerCase();
        
        if (fontFamily.includes('inter') && !fontFamily.includes('ui-sans-serif')) {
          interFound = true;
        }
        if (fontFamily.includes('brygada')) {
          brygadaFound = true;
        }
        
        if (interFound && brygadaFound) break;
      }
      
      return interFound && brygadaFound;
    };
    
    for (let i = 0; i < 30; i++) {
      if (verifyFontsInUse()) {
        break;
      }
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
    
    const waitForLayoutStable = async () => {
      const getLayoutMetrics = () => {
        const body = document.body;
        const html = document.documentElement;
        return {
          bodyHeight: body.scrollHeight,
          bodyWidth: body.scrollWidth,
          htmlHeight: html.scrollHeight,
          htmlWidth: html.scrollWidth,
        };
      };
      
      let lastMetrics = getLayoutMetrics();
      let stableCount = 0;
      
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        document.body.offsetHeight;
        document.documentElement.offsetHeight;
        
        const currentMetrics = getLayoutMetrics();
        
        if (currentMetrics.bodyHeight === lastMetrics.bodyHeight &&
            currentMetrics.bodyWidth === lastMetrics.bodyWidth &&
            currentMetrics.htmlHeight === lastMetrics.htmlHeight &&
            currentMetrics.htmlWidth === lastMetrics.htmlWidth) {
          stableCount++;
          if (stableCount >= 10) {
            break;
          }
        } else {
          stableCount = 0;
          lastMetrics = currentMetrics;
        }
      }
    };
    
    await waitForLayoutStable();
    
    await new Promise(resolve => setTimeout(resolve, 300));
  });
  
  await page.waitForTimeout(200);
}
