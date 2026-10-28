import type { MDXInstance } from "astro";

import type { PostFrontmatter } from "../types";

import { isPostVisible } from "./isPostVisible";

const postModules = import.meta.glob<MDXInstance<PostFrontmatter>>(
  "../../posts/**/*.mdx",
  { eager: true },
);

export const visiblePosts = Object.values(postModules).filter((post) =>
  isPostVisible(post.frontmatter, { isProd: import.meta.env.PROD }),
);
