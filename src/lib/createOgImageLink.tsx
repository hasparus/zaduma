import { createHmac } from "node:crypto";

import type { StringifiedPost } from "../../api/og";
import type { PostFrontmatter } from "../types/PostFrontmatter";

const OG_IMAGE_SECRET = import.meta.env.OG_IMAGE_SECRET;

export function createOgImageLink(frontmatter: PostFrontmatter) {
  // prettier-ignore
  const stringifiedPost: StringifiedPost = `${
    new Date(frontmatter.date).getTime()
  }\t${
    frontmatter.readingTime.minutes
  }\t${
    frontmatter.title
  }\t${
    frontmatter.img || ""
  }`;

  const hmac = createHmac("sha256", OG_IMAGE_SECRET);
  hmac.update(stringifiedPost);
  const token = hmac.digest("hex");

  return `/api/og?post=${encodeURIComponent(stringifiedPost)}&token=${token}`;
}
