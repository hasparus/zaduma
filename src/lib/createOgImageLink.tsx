import { createHmac } from "node:crypto";

import type { StringifiedPost } from "../../api/og";
import type { PostFrontmatter } from "../types/PostFrontmatter";
import { OG_IMAGE_SECRET } from "astro:env/server";

export function createOgImageLink(frontmatter: PostFrontmatter) {
  if (!OG_IMAGE_SECRET) {
    // Gracefully degrade when secret is not set (CI, local dev)
    return undefined;
  }

  let img = frontmatter.img;
  if (typeof img === "object") img = img.og || img.src;

  // prettier-ignore
  const stringifiedPost: StringifiedPost = `${
    new Date(frontmatter.date).getTime()
  }\t${
    frontmatter.readingTime.minutes
  }\t${
    frontmatter.title
  }\t${
    img?.replace(/^raw!/, "") || ""
  }`;

  const hmac = createHmac("sha256", OG_IMAGE_SECRET);
  hmac.update(stringifiedPost);
  const token = hmac.digest("hex");

  return `/api/og?post=${encodeURIComponent(stringifiedPost)}&token=${token}`;
}
