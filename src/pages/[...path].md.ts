import type { APIRoute, GetStaticPaths } from "astro";

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

export const getStaticPaths: GetStaticPaths = () => {
  let entries = Object.entries(postModules);

  if (import.meta.env.PROD) {
    entries = entries.filter(([, m]) => !m.frontmatter.draft);
  }

  return entries.map(([key, mod]) => ({
    params: { path: mod.frontmatter.path.replace(/^\//, "") },
    props: { raw: rawModules[key] ?? "", title: mod.frontmatter.title },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { raw, title } = props as { raw: string; title: string };
  const body = `# ${title}\n\n${stripFrontmatter(raw).trim()}\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
