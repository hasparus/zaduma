import type { APIRoute, GetStaticPaths } from "astro";

import { postMarkdown, routeParamOf, visiblePosts } from "../lib/posts";

export const getStaticPaths: GetStaticPaths = () =>
  visiblePosts.map((post) => ({
    params: { path: routeParamOf(post.frontmatter) },
    props: { body: postMarkdown(post) },
  }));

export const GET: APIRoute = ({ props }) =>
  new Response((props as { body: string }).body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
