import { relative } from "node:path";

/**
 * Canonical site path for a post file, e.g. `/features/asides`
 * (no trailing slash). Single source of truth shared by the runtime
 * (via `urlOutsideOfPagesDirPlugin`) and the build-time sitemap scanner.
 */
export function postPath(postsDir: string, filePath: string): string {
  return (
    "/" +
    relative(postsDir, filePath)
      .replace(/\\/g, "/")
      .replace(/\.mdx?$/, "")
      .replace(/ /g, "-")
  );
}
