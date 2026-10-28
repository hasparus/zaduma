import type { APIRoute } from "astro";

import { visiblePosts as posts } from "../lib/posts";
import { SITE_BLURB, SITE_NAME } from "../lib/siteMeta";

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("`site` must be set in astro.config for llms.txt");
  }

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_BLURB}`,
    "",
    "## Posts",
    "",
  ];

  for (const { frontmatter } of posts) {
    const url = new URL(frontmatter.path, site).href;
    const desc = frontmatter.description?.trim() ?? "";
    const suffix = desc ? `: ${desc}` : "";
    lines.push(`- [${frontmatter.title}](${url})${suffix}`);
  }

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
