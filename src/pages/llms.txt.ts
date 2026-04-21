import type { APIRoute } from "astro";

import { isPostVisible } from "../lib/isPostVisible";
import type { PostFrontmatter } from "../types";

// TODO(downstream): override site name + blurb per site.
const SITE_NAME = "Zaduma";
const BLURB = "A blog.";

const postModules = import.meta.glob<{ frontmatter: PostFrontmatter }>(
  "../../posts/**/*.mdx",
  { eager: true },
);

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("`site` must be set in astro.config for llms.txt");
  }

  const posts = Object.values(postModules)
    .filter((p) => isPostVisible(p.frontmatter))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );

  const lines: string[] = [];
  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(`> ${BLURB}`);
  lines.push("");
  lines.push("## Posts");
  lines.push("");

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
