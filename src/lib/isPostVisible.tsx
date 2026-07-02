import type { PostFrontmatter } from "../types";

export function isPostVisible(
  frontmatter: Pick<PostFrontmatter, "hidden" | "draft">,
  { isProd }: { isProd: boolean },
): boolean {
  return !frontmatter.hidden && !(isProd && frontmatter.draft);
}
