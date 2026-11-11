import type { ImageMetadata } from "astro";
import { dirname, join, relative, sep } from "node:path";

import type { PostFrontmatter } from "../types/PostFrontmatter";

const postImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/posts/**/*.{png,jpg,jpeg,webp,avif,gif}",
);

/**
 * Validates `img` and `og` frontmatter and imports their `./` paths from next
 * to the post, so Astro emits and optimizes them. `file` is the post's
 * absolute path (`MDXInstance.file`).
 */
export async function resolvePostImages(
  { img, og = {} }: PostFrontmatter,
  file: string,
) {
  if (img !== undefined && typeof img !== "string") {
    throw new TypeError(
      `${file}: img must be a path. img.src, img.og and img.ogVideo moved to img, og.image and og.video`,
    );
  }
  if (typeof og !== "object" || og === null) {
    throw new TypeError(
      `${file}: og must be { image?, backgroundImage?, video? }`,
    );
  }
  if (og.image && og.backgroundImage) {
    throw new Error(`${file}: set og.image or og.backgroundImage, not both`);
  }
  if (
    og.video !== undefined &&
    !/^(\/|https:\/\/)[^?#]+\.mp4([?#].*)?$/.test(og.video)
  ) {
    throw new Error(
      `${file}: og.video must be an absolute path or URL to an .mp4, got "${og.video}"`,
    );
  }

  const [header, image, backgroundImage] = await Promise.all([
    img?.startsWith(".") ? importPostImage(file, img) : img,
    urlOf(file, og.image),
    urlOf(file, og.backgroundImage),
  ]);
  return {
    img: header,
    og: {
      image,
      backgroundImage:
        backgroundImage ?? (typeof header === "object" ? header.src : header),
      video: og.video,
    },
  };
}

export type ResolvedPostImages = Awaited<ReturnType<typeof resolvePostImages>>;

/** Keeps the query, which `/api/og` may read as card options. */
async function urlOf(file: string, path: string | undefined) {
  if (!path?.startsWith(".")) return path;
  const [pathname, query] = path.split("?");
  const { src } = await importPostImage(file, pathname!);
  return query ? `${src}?${query}` : src;
}

async function importPostImage(file: string, path: string) {
  const fromRoot = relative(process.cwd(), join(dirname(file), path));
  const key = "/" + fromRoot.split(sep).join("/");
  const load = postImageGlob[key];
  if (!load) throw new Error(`Image ${key} not found, referenced from ${file}`);

  const { default: image } = await load();
  return image;
}
