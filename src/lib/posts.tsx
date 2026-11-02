import type { MDXInstance } from "astro";

import type { PostFrontmatter } from "../types";

import { isPostVisible } from "./isPostVisible";

const postModules = import.meta.glob<MDXInstance<PostFrontmatter>>(
  "../../posts/**/*.mdx",
  { eager: true },
);

const rawSources = import.meta.glob<string>("../../posts/**/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default",
});
const sourceOf = new Map(
  Object.entries(postModules).map(([key, post]) => [post, rawSources[key]]),
);

/** Posts visible in this build, newest first. */
export const visiblePosts: readonly MDXInstance<PostFrontmatter>[] =
  Object.values(postModules)
    .filter((post) =>
      isPostVisible(post.frontmatter, { isProd: import.meta.env.PROD }),
    )
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );

/** The `[...path]` route param for a post. */
export const routeParamOf = ({ path }: PostFrontmatter) =>
  path.replace(/^\//, "");

/** The post's MDX source under its title, without frontmatter. */
export function postMarkdown(post: MDXInstance<PostFrontmatter>) {
  const source = sourceOf.get(post) ?? "";
  const end = source.startsWith("---") ? source.indexOf("\n---", 3) : -1;
  const body =
    end === -1 ? source : source.slice(end + 4).replace(/^\r?\n/, "");
  return `# ${post.frontmatter.title}\n\n${body.trim()}\n`;
}
