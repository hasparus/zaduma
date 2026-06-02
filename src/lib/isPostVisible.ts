import type { PostFrontmatter } from "../types";

export function isPostVisible(
  frontmatter: Pick<PostFrontmatter, "hidden" | "draft">,
  { isProd = import.meta.env?.PROD }: { isProd?: boolean } = {},
): boolean {
  if (frontmatter.hidden) return false;
  if (isProd && frontmatter.draft) return false;
  return true;
}
