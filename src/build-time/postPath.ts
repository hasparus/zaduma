import { relative } from "node:path";

export function postPath(postsDir: string, filePath: string): string {
  return (
    "/" +
    relative(postsDir, filePath)
      .replace(/\\/g, "/")
      .replace(/\.mdx?$/, "")
      .replace(/ /g, "-")
  );
}
