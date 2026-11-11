import { OG_IMAGE_SECRET } from "astro:env/server";
import { createHmac } from "node:crypto";

import type { StringifiedPost } from "../../api/og";
import type { PostFrontmatter } from "../types/PostFrontmatter";

import type { ResolvedPostImages } from "./postImages";
import { routeParamOf } from "./posts";

export interface SocialCard {
  image: string;
  /** A looping mp4 and the page X's player card embeds to play it. */
  video?: { player: string; src: string };
}

/** A ready-made `img.og` is served as is. Otherwise `/api/og` draws a card over `img.src`. */
export function socialCardOf(
  frontmatter: PostFrontmatter,
  { og, src, ogVideo }: ResolvedPostImages,
): SocialCard {
  return {
    image:
      og ??
      createOgImageLink(frontmatter, typeof src === "object" ? src.src : src),
    ...(ogVideo && {
      video: {
        player: `/og/player/${routeParamOf(frontmatter)}/`,
        src: ogVideo,
      },
    }),
  };
}

function createOgImageLink(
  frontmatter: PostFrontmatter,
  img: string | undefined,
) {
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
