import type { ImageMetadata } from "astro";
import { dirname, join } from "node:path";

import type { PostFrontmatter } from "../types/PostFrontmatter";

const postImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/posts/**/*.{png,jpg,jpeg,webp,avif,gif}",
);

/** Normalizes `img` frontmatter, rejecting an `ogVideo` that isn't the mp4 `og:video:type` announces. */
export function postImages({ img }: PostFrontmatter) {
  const { og, src, ogVideo } = typeof img === "object" ? img : { src: img };
  if (ogVideo !== undefined && !/\.mp4$/.test(ogVideo)) {
    throw new Error(`img.ogVideo must be an .mp4, got "${ogVideo}"`);
  }
  return { og: og || src, ogVideo, src };
}

/** Resolves an image colocated with a post (`./diagram.png`) against the post's file path. */
export async function resolvePostImage(file: string, src: string) {
  const postsAt = file.indexOf("/posts/");
  if (postsAt === -1) {
    throw new Error(`Expected a post under /posts/, got ${file}`);
  }
  const key = join(dirname(file.slice(postsAt)), src);
  const load = postImageGlob[key];
  if (!load) throw new Error(`Image not found: ${key} (from ${file})`);

  const { default: image } = await load();
  return { image, fsPath: join(process.cwd(), key) };
}

/** Resolves `./`-relative paths to the URL Astro emits for the colocated image. */
export async function resolveIfRelative(file: string, src: string | undefined) {
  if (!src?.startsWith(".")) return src;
  const { image } = await resolvePostImage(file, src);
  return image.src;
}
