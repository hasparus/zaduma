import { OG_IMAGE_SECRET } from "astro:env/server";
import { createHmac } from "node:crypto";

import type { StringifiedPost } from "../../api/og";
import type { PostFrontmatter } from "../types/PostFrontmatter";

import { postImages, resolveIfRelative } from "./postImages";
import { routeParamOf } from "./posts";

export interface SocialCard {
  image: string;
  /** A looping mp4 and the page X's player card embeds to play it. */
  video?: { player: string; src: string };
}

/** `file` is the post's path, used to resolve `./`-relative `img` frontmatter. */
export async function socialCardOf(
  frontmatter: PostFrontmatter,
  file: string,
): Promise<SocialCard> {
  const { og, ogVideo } = postImages(frontmatter);
  return {
    image: createOgImageLink(frontmatter, await resolveIfRelative(file, og)),
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
