import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
const HIDDEN = /^\s*hidden:\s*true\s*$/m;
const DRAFT = /^\s*draft:\s*true\s*$/m;

function postUrl(postsDir: string, absPath: string): string {
  const slug = relative(postsDir, absPath)
    .replace(/\\/g, "/")
    .replace(/\.mdx$/, "")
    .replace(/ /g, "-");
  return `/${slug}/`;
}

function walk(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else if (entry.name.endsWith(".mdx")) out.push(abs);
  }
}

export function getHiddenPostUrls(postsDir: string): Set<string> {
  const files: string[] = [];
  walk(postsDir, files);
  const hidden = new Set<string>();
  for (const abs of files) {
    const fm = readFileSync(abs, "utf8").match(FRONTMATTER)?.[1];
    if (!fm) continue;
    if (HIDDEN.test(fm) || DRAFT.test(fm)) hidden.add(postUrl(postsDir, abs));
  }
  return hidden;
}
