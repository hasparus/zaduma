import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("renders with article list", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText("zaduma");
    // Check that article links are present
    const articles = page.locator("ul li a");
    await expect(articles).toHaveCount(7);
    // Verify some known titles
    await expect(page.getByText("OG Images")).toBeVisible();
    await expect(page.getByText("Asides")).toBeVisible();
    await expect(page.getByText("Shiki Twoslash")).toBeVisible();
    await expect(page.getByText("Markdown Cheat Sheet")).toBeVisible();
  });
});

test.describe("Article pages", () => {
  test("asides page renders correctly", async ({ page }) => {
    await page.goto("/features/asides/");
    await expect(page.locator("h1")).toHaveText("Asides");
    await expect(page.getByText("<aside>")).toBeVisible();
    await expect(page.locator("time")).toBeVisible();
  });

  test("shiki-twoslash page renders correctly", async ({ page }) => {
    await page.goto("/features/shiki-twoslash/");
    await expect(page.locator("h1")).toHaveText("Shiki Twoslash");
    // Should have code blocks with syntax highlighting
    const shikiBlocks = await page.locator("pre.astro-code").count();
    expect(shikiBlocks).toBeGreaterThanOrEqual(2);
  });

  test("frontmatter page renders correctly", async ({ page }) => {
    await page.goto("/features/post-with-frontmatter/");
    await expect(page.locator("h1")).toHaveText("Frontmatter");
    await expect(page.locator("time")).toHaveText("2022-10-04");
  });
});

test.describe("Asides render as side notes on wide viewports", () => {
  test("aside positioned to the right on desktop", async ({
    page,
    browserName,
  }, testInfo) => {
    
    await page.goto("/features/asides/");
    const aside = page.locator("aside").first();
    await expect(aside).toBeVisible();

    if (testInfo.project.name !== "mobile") {
      const box = await aside.boundingBox();
      expect(box?.x).toBeGreaterThan(300);
    }
  });
});

test.describe("Code blocks render with syntax highlighting", () => {
  test("code blocks have syntax colors", async ({ page }) => {
    await page.goto("/features/shiki-twoslash/");
    // Shiki generates spans with color styles
    const coloredSpans = page.locator("pre.astro-code span[style*='color']");
    const count = await coloredSpans.count();
    expect(count).toBeGreaterThan(5);
  });
});

  

test.describe("OG images", () => {
  test("og meta tags are present on article pages", async ({ page }) => {
    await page.goto("/features/og-images/");
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", /.+/);
  });
});

test("homepage is readable on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-specific test");
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  const articles = page.locator("ul li a");
  await expect(articles).toHaveCount(7);
  // Content should not overflow
  const body = page.locator("body");
  const box = await body.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(375);
});

test("color scheme switches with command palette and responds to media preference", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  
  if (testInfo.project.name !== "mobile") {
    
    try {
      await page.keyboard.press("ControlOrMeta+K");
    } catch {
      await page.getByLabel("Open command palette").click();
    }

    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Alt+T");
    await expect(page.getByText("Set Theme to Dark")).toBeVisible();
    await page.keyboard.press("2");
    await expect(page.locator("html")).toHaveClass("dark");
    await expect(page.getByRole("dialog")).not.toBeVisible();

    await page.keyboard.press("ControlOrMeta+K");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Alt+T");
    await expect(page.getByText("Set Theme to Light")).toBeVisible();
    await page.keyboard.press("1");
    await expect(page.locator("html")).not.toHaveClass("dark");
    await expect(page.getByRole("dialog")).not.toBeVisible();

    await page.keyboard.press("ControlOrMeta+K");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Alt+T");
    await expect(page.getByText("Set Theme to System")).toBeVisible();
    await page.keyboard.press("3");
    await expect(page.locator("html")).not.toHaveClass("dark");
    await expect(page.getByRole("dialog")).not.toBeVisible();    
  }

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass("dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).not.toHaveClass("dark");

  await page.emulateMedia({ colorScheme: null });
});
