import rss from "@astrojs/rss";

import { visiblePosts as posts } from "../lib/posts";

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
