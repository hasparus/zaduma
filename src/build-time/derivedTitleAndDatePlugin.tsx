import { execSync } from "node:child_process";

import type { RemarkPlugin } from "@astrojs/markdown-remark/dist/types";

import type { PostFrontmatter, PostProps } from "../types";

export const derivedTitleAndDatePlugin: RemarkPlugin<
  [{ title: (fileStem: string) => string }]
> = ({ title }) => {
  return (_tree, file) => {
    const data = file.data as { astro: PostProps };
    const frontmatter = data.astro.frontmatter as Partial<PostFrontmatter>;

    if (!frontmatter.title) {
      frontmatter.title = title(file.stem || "");
    }

    if (!frontmatter.date) {
      const createdAt = execSync(
        `git log -1 --format="%ai" --reverse ${file.path}`,
        { encoding: "utf-8" }
      ).trim();

      frontmatter.date = createdAt;
    }
  };
};
