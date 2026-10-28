import type { MDXInstance } from "astro";

import type { PostFrontmatter } from "../types";

import { isPostVisible } from "./isPostVisible";

const postModules = import.meta.glob<MDXInstance<PostFrontmatter>>(
  "../../posts/**/*.mdx",
  { eager: true },
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
