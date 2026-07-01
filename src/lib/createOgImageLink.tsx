import { OG_IMAGE_SECRET } from "astro:env/server";
import { createHmac } from "node:crypto";

import type { StringifiedPost } from "../../api/og";
import type { PostFrontmatter } from "../types/PostFrontmatter";

export function createOgImageLink(frontmatter: PostFrontmatter) {
  let { img } = frontmatter;
  if (typeof img === "object") img = img.og || img.src;

  const timestamp = new Date(frontmatter.date).getTime();
  const { minutes } = frontmatter.readingTime;
  const { title } = frontmatter;
  const image = img?.replace(/^raw!/, "") || "";

  const stringifiedPost: StringifiedPost = `${timestamp}\t${minutes}\t${title}\t${image}`;

  const hmac = createHmac("sha256", OG_IMAGE_SECRET);
  hmac.update(stringifiedPost);
  const token = hmac.digest("hex");

  return `/api/og?post=${encodeURIComponent(stringifiedPost)}&token=${token}`;
}
