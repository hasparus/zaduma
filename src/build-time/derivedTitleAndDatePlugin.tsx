import { execFileSync } from "node:child_process";
import type { Plugin } from "unified";

import type { PostFrontmatter, PostProps } from "../types";

export const derivedTitleAndDatePlugin: Plugin<
  [{ title: (fileStem: string) => string }]
> = ({ title }) => {
  return (_tree, file) => {
    const data = file.data as { astro: PostProps };
    const frontmatter = data.astro.frontmatter as Partial<PostFrontmatter>;

    frontmatter.title ||= title(file.stem || "");

    if (!frontmatter.date) {
      let createdAt: string;
      try {
        createdAt =
          execFileSync(
            "git",
            [
              "log",
              "--follow",
              "--diff-filter=A",
              "--find-renames=40%",
              "--format=%ai",
              file.path,
            ],
            { encoding: "utf8" },
          )
            .trim()
            .split("\n")[0] || new Date().toISOString();
      } catch {
        createdAt = new Date().toISOString();
      }

      frontmatter.date = createdAt;
    }
  };
};
