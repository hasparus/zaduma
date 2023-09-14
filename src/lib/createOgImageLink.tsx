import { createHmac } from "node:crypto";

import type { StringifiedPost } from "../../api/og";
import type { PostFrontmatter } from "../types/PostFrontmatter";

declare global {
  interface ImportMetaEnv {
    OG_IMAGE_SECRET?: string;
  }
}

const OG_IMAGE_SECRET =
  import.meta.env.OG_IMAGE_SECRET ||
  (() => {
    throw new Error("OG_IMAGE_SECRET is not set");
  })();

export function createOgImageLink(frontmatter: PostFrontmatter) {
  let img = frontmatter.img;
  if (typeof img === "object") img = img.og;

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
