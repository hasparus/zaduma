import { relative } from "node:path";
import type { Plugin } from "unified";

import type { PostProps } from "../types";

export const urlOutsideOfPagesDirPlugin: Plugin<
  [{ absoluteDirPath: string }]
> = ({ absoluteDirPath }) => {
  return (_tree, file) => {
    const props = (file.data as { astro: PostProps }).astro;

    // We can't assign to `props.url` so we take `frontmatter.path`
    props.frontmatter.path =
      "/" +
      relative(absoluteDirPath, file.path)
        .replace(/\\/g, "/")
        .replace(file.extname || "", "")
        .replace(/ /g, "-");
  };
};
