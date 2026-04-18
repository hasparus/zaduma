import type { APIRoute } from "astro";

// AI/LLM training & answer-engine crawlers. Default to Allow so the starter
// is "agent-ready"; downstream sites can override this list.
const AI_BOTS = [
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

// https://contentsignals.org — opt-in signal for how crawled content may be used.
const CONTENT_SIGNALS = "search, ai-train: yes";

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("`site` must be set in astro.config for robots.txt");
  }

  const lines: string[] = [];

  lines.push("User-agent: *");
  lines.push("Allow: /");
  lines.push("");

  for (const bot of AI_BOTS) {
    lines.push(`User-agent: ${bot}`);
    lines.push("Allow: /");
    lines.push("");
  }

  lines.push(`Content-Signals: ${CONTENT_SIGNALS}`);
  lines.push(`Sitemap: ${new URL("sitemap-index.xml", site).href}`);

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
