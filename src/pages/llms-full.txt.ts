import type { APIRoute } from "astro";

import { isPostVisible } from "../lib/isPostVisible";
import type { PostFrontmatter } from "../types";

const postModules = import.meta.glob<{ frontmatter: PostFrontmatter }>(
  "../../posts/**/*.mdx",
  { eager: true },
);

const rawModules = import.meta.glob<string>("../../posts/**/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default",
});

function stripFrontmatter(source: string): string {
  if (!source.startsWith("---")) return source;
  const end = source.indexOf("\n---", 3);
  if (end === -1) return source;
  return source.slice(end + 4).replace(/^\r?\n/, "");
}

export const GET: APIRoute = () => {
  const entries = Object.entries(postModules)
    .filter(([, m]) => isPostVisible(m.frontmatter))
    .sort(
      ([, a], [, b]) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );

  const chunks: string[] = [];
  for (const [key, { frontmatter }] of entries) {
    const raw = rawModules[key] ?? "";
    chunks.push(`# ${frontmatter.title}\n\n${stripFrontmatter(raw).trim()}\n`);
  }

  return new Response(chunks.join("\n---\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
