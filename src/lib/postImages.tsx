import type { ImageMetadata } from "astro";
import { dirname, join, relative, sep } from "node:path";

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
  return { og, ogVideo, src };
}

export type ResolvedPostImages = Awaited<ReturnType<typeof resolvePostImages>>;

/**
 * `postImages` with `./` paths imported from next to the post, so Astro emits
 * and optimizes them. `file` is the post's absolute path (`MDXInstance.file`).
 */
export async function resolvePostImages(
  frontmatter: PostFrontmatter,
  file: string,
) {
  const { og, src, ogVideo } = postImages(frontmatter);
  const resolve = (path: string | undefined) =>
    path?.startsWith(".") ? importPostImage(file, path) : path;

  const [srcImage, ogImage] = await Promise.all([resolve(src), resolve(og)]);
  return {
    src: srcImage,
    og: typeof ogImage === "object" ? ogImage.src : ogImage,
    ogVideo,
  };
}

async function importPostImage(file: string, path: string) {
  const fromRoot = relative(process.cwd(), join(dirname(file), path));
  const key = "/" + fromRoot.split(sep).join("/");
  const load = postImageGlob[key];
  if (!load) throw new Error(`Image ${key} not found, referenced from ${file}`);

  const { default: image } = await load();
  return image;
}
