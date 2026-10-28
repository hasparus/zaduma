import { OG_IMAGE_SECRET } from "astro:env/server";
import { createHmac } from "node:crypto";

import type { StringifiedPost } from "../../api/og";
import type { PostFrontmatter } from "../types/PostFrontmatter";

/** Normalizes `img` frontmatter, rejecting an `ogVideo` the /og/player page won't play. */
export function postImages({ img }: PostFrontmatter) {
  const { og, src, ogVideo } = typeof img === "object" ? img : { src: img };
  if (ogVideo !== undefined && !/^\/content\/.+\.mp4$/.test(ogVideo)) {
    throw new Error(
      `img.ogVideo must be a /content/<slug>/<name>.mp4 path under public/, got "${ogVideo}"`,
    );
  }
  return { og: og || src, ogVideo, src };
}

export interface SocialCard {
  image: string;
  /** A looping mp4 and the page X's player card embeds to play it. */
  video?: { player: string; src: string };
}

/** The `[...path]` param of a post's /og/player page. */
export const playerParamOf = ({ path }: PostFrontmatter) =>
  path.replace(/^\//, "");

export function socialCardOf(frontmatter: PostFrontmatter): SocialCard {
  const { ogVideo } = postImages(frontmatter);
  return {
    image: createOgImageLink(frontmatter),
    ...(ogVideo && {
      video: {
        player: `/og/player/${playerParamOf(frontmatter)}/`,
        src: ogVideo,
      },
    }),
  };
}

export function createOgImageLink(frontmatter: PostFrontmatter) {
  const img = postImages(frontmatter).og;

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
