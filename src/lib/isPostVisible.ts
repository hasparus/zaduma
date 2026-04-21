import type { PostFrontmatter } from "../types";

export function isPostVisible(
  frontmatter: Pick<PostFrontmatter, "hidden" | "draft">,
): boolean {
  if (frontmatter.hidden) return false;
  if (import.meta.env.PROD && frontmatter.draft) return false;
  return true;
}
