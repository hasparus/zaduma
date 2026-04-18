import { expect, test } from "@playwright/test";

test.describe("agent-ready endpoints", () => {
  test("/robots.txt allows AI bots and links to sitemap", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();

    expect(body).toMatch(/^User-agent: \*\nAllow: \//m);

    const bots = [
      "GPTBot",
      "ClaudeBot",
      "ClaudeUser",
      "PerplexityBot",
      "Google-Extended",
      "CCBot",
      "Applebot-Extended",
      "Bytespider",
      "Amazonbot",
    ];
    for (const bot of bots) {
      expect(body).toContain(`User-agent: ${bot}`);
    }

    expect(body).toContain("Content-Signals: search, ai-train: yes");
    expect(body).toMatch(/^Sitemap: https?:\/\/.+\/sitemap-index\.xml$/m);
  });

  test("/sitemap-index.xml is emitted and references a sitemap", async ({
    request,
  }) => {
    const res = await request.get("/sitemap-index.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("<sitemapindex");
    expect(body).toMatch(/<loc>[^<]+sitemap-\d+\.xml<\/loc>/);
  });

  test("/llms.txt lists posts in the expected shape", async ({ request }) => {
    const res = await request.get("/llms.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();

    expect(body).toMatch(/^# .+/m);
    expect(body).toContain("## Posts");
    // At least one known post rendered as `- [Title](absolute-url)`
    expect(body).toMatch(
      /- \[Asides\]\(https?:\/\/[^)]+\/features\/asides\)/,
    );
  });

  test("/llms-full.txt concatenates raw post bodies without frontmatter", async ({
    request,
  }) => {
    const res = await request.get("/llms-full.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();

    expect(body).toContain("# Asides");
    expect(body).toContain("---"); // separator between posts
    // Frontmatter fences should be stripped — the file starts with `---\ntags:`,
    // so a leading `tags:` line would prove we leaked frontmatter.
    expect(body).not.toMatch(/^tags:\s*\[/m);
  });

  test("/<post>.md returns raw markdown body with the title heading", async ({
    request,
  }) => {
    const res = await request.get("/features/asides.md");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body.startsWith("# Asides")).toBe(true);
    expect(body).not.toMatch(/^---\n/);
  });
});

test.describe("head metadata for agents", () => {
  test("post page has canonical, markdown alt, and JSON-LD", async ({
    page,
  }) => {
    await page.goto("/features/asides/");

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      "href",
      /https?:\/\/.+\/features\/asides\/?$/,
    );

    const mdAlt = page.locator(
      'link[rel="alternate"][type="text/markdown"]',
    );
    await expect(mdAlt).toHaveAttribute(
      "href",
      /https?:\/\/.+\/features\/asides\.md$/,
    );

    const jsonLdBlocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const parsed = jsonLdBlocks.map((t) => JSON.parse(t));
    const types = parsed.map((p) => p["@type"]);
    expect(types).toContain("WebSite");
    expect(types).toContain("BlogPosting");

    const post = parsed.find((p) => p["@type"] === "BlogPosting");
    expect(post.headline).toBe("Asides");
    expect(typeof post.datePublished).toBe("string");
    expect(post.mainEntityOfPage["@id"]).toMatch(/\/features\/asides\/?$/);
  });

  test("homepage has canonical but no markdown alternate", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /https?:\/\/.+\/$/,
    );
    await expect(
      page.locator('link[rel="alternate"][type="text/markdown"]'),
    ).toHaveCount(0);
  });
});
