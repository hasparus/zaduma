import type { APIRoute } from "astro";

import { postMarkdown, visiblePosts } from "../lib/posts";

export const GET: APIRoute = () =>
  new Response(visiblePosts.map(postMarkdown).join("\n---\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
