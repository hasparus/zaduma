import matter from "gray-matter";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { isPostVisible } from "../lib/isPostVisible";

import { postPath } from "./postPath";

function walk(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else if (/\.(md|mdx)$/.test(entry.name)) out.push(abs);
  }
}

export function getHiddenPostPaths(
  postsDir: string,
  { isProd }: { isProd: boolean },
): Set<string> {
  const files: string[] = [];
  walk(postsDir, files);
  const hidden = new Set<string>();
  for (const abs of files) {
    const source = readFileSync(abs, "utf8");
    const { data } = matter(source);
    const frontmatter = {
      hidden: data.hidden === true,
      draft: data.draft === true,
    };
    if (!isPostVisible(frontmatter, { isProd })) {
      hidden.add(postPath(postsDir, abs));
    }
  }
  return hidden;
}
