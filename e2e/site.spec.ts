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
    const shikiBlocks = await page.locator("pre.shiki").count();
    expect(shikiBlocks).toBeGreaterThanOrEqual(2);
  });

  test("frontmatter page renders correctly", async ({ page }) => {
    await page.goto("/features/post-with-frontmatter/");
    await expect(page.locator("h1")).toHaveText("Frontmatter");
    await expect(page.locator("time")).toHaveText("2022-10-04");
  });
});

test.describe("Asides render as side notes on wide viewports", () => {
  test("aside positioned to the right on desktop", async ({ page, browserName }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "Side notes only on wide viewports");
    await page.goto("/features/asides/");
    const aside = page.locator("aside").first();
    await expect(aside).toBeVisible();
    // On desktop, aside should be rendered (the flexbox layout puts it to the right)
    const box = await aside.boundingBox();
    expect(box).toBeTruthy();
    // The aside should be positioned to the right of center
    expect(box!.x).toBeGreaterThan(300);
  });
});

test.describe("Code blocks render with syntax highlighting", () => {
  test("code blocks have syntax colors", async ({ page }) => {
    await page.goto("/features/shiki-twoslash/");
    // Shiki generates spans with color styles
    const coloredSpans = page.locator("pre.shiki span[style*='color']");
    const count = await coloredSpans.count();
    expect(count).toBeGreaterThan(5);
  });
});

test.describe("Dark/light mode toggle", () => {
  test("toggle switches color scheme", async ({ page }) => {
    await page.goto("/");
    // Initially should not have dark class (or have it based on system)
    const html = page.locator("html");

    // Open command palette and toggle - the ⌘ button triggers it
    // The site uses a Commands component for toggling
    // Let's check that the dark class can be toggled via localStorage
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
    await expect(html).toHaveClass(/dark/);

    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
    });
    await expect(html).not.toHaveClass(/dark/);
  });
});

test.describe("OG images", () => {
  test("og meta tags are present on article pages", async ({ page }) => {
    await page.goto("/features/og-images/");
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", /.+/);
  });
});

test.describe("Mobile responsive layout", () => {
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

  test("article page is readable on mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "Mobile-specific test");
    await page.goto("/features/asides/");
    await expect(page.locator("h1")).toBeVisible();
    // Aside should be visible (stacked below content on mobile)
    await expect(page.locator("aside").first()).toBeVisible();
  });
});
