import rss from "@astrojs/rss";

import { isPostVisible } from "../lib/isPostVisible";
import type { PostProps } from "../types";

const postImportResult = import.meta.glob<PostProps>("../../posts/**/*.mdx", {
  eager: true,
});
const posts = Object.values(postImportResult).filter((p) =>
  isPostVisible(p.frontmatter, { isProd: import.meta.env.PROD }),
);

export const GET = () =>
  rss({
    title: "",
    description: "",
    site: "https://haspar.us",
    items: posts.map(({ frontmatter }) => ({
      title: frontmatter.title,
      link: frontmatter.path,
      pubDate: new Date(frontmatter.date),
    })),
  });
