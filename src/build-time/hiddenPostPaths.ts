import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { isPostVisible } from "../lib/isPostVisible";

import { postPath } from "./postPath";

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
const HIDDEN = /^\s*hidden:\s*true\s*$/m;
const DRAFT = /^\s*draft:\s*true\s*$/m;

function walk(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else if (entry.name.endsWith(".mdx")) out.push(abs);
  }
}

/**
 * Canonical post paths (no trailing slash) that must be excluded from the
 * sitemap. Mirrors the runtime `isPostVisible` policy exactly — same path
 * normalization (`postPath`) and same draft/hidden semantics — so the sitemap
 * never drifts from the rest of the site. `isProd` selects the draft policy:
 * drafts are hidden only in production builds.
 */
export function getHiddenPostPaths(
  postsDir: string,
  { isProd }: { isProd: boolean },
): Set<string> {
  const files: string[] = [];
  walk(postsDir, files);
  const hidden = new Set<string>();
  for (const abs of files) {
    const fm = readFileSync(abs, "utf8").match(FRONTMATTER)?.[1];
    if (!fm) continue;
    const frontmatter = { hidden: HIDDEN.test(fm), draft: DRAFT.test(fm) };
    if (!isPostVisible(frontmatter, { isProd })) {
      hidden.add(postPath(postsDir, abs));
    }
  }
  return hidden;
}
