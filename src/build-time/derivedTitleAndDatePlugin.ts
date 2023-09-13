import { execSync } from "node:child_process";
import type { Plugin } from "unified";

import type { PostFrontmatter, PostProps } from "../types";

export const derivedTitleAndDatePlugin: Plugin<
  [{ title: (fileStem: string) => string }]
> = ({ title }) => {
  return (_tree, file) => {
    const data = file.data as { astro: PostProps };
    const frontmatter = data.astro.frontmatter as Partial<PostFrontmatter>;

    if (!frontmatter.title) {
      frontmatter.title = title(file.stem || "");
    }

    if (!frontmatter.date) {
      let createdAt = execSync(
        `git log --follow --diff-filter=A --find-renames=40% --format="%ai" "${file.path}"`,
        { encoding: "utf-8" },
      )
        .trim()
        .split("\n")[0];

      if (!createdAt) {
        // if the file wasn't committed yet, we use the current date
        createdAt = new Date().toISOString();
      }

      frontmatter.date = createdAt;
    }
  };
};
