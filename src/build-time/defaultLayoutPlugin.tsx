import { relative } from "node:path";
import type { RemarkPlugin } from "@astrojs/markdown-remark/dist/types";
import type { PostProps } from "../types";

export const defaultLayoutPlugin: RemarkPlugin<[{ layoutPath: string }]> = ({
  layoutPath,
}: {
  layoutPath: string;
}) => {
  return (_tree, file) => {
    const data = file.data as { astro: PostProps };

    data.astro.frontmatter.layout = relative(file.dirname!, layoutPath);
  };
};
