// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";
import mdx from "@astrojs/mdx";
import type { RemarkPlugins } from "astro";
import type { RemarkPlugin } from "@astrojs/markdown-remark/dist/types";
import type { PostFrontmatter, PostProps } from "./src/types";
import { titleCase } from "./src/lib/titleCase";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const defaultLayoutPlugin: RemarkPlugin<[{ layoutPath: string }]> = ({
  layoutPath,
}: {
  layoutPath: string;
}) => {
  return (_tree, file) => {
    const data = file.data as { astro: PostProps };

    data.astro.frontmatter.layout = relative(file.dirname!, layoutPath);
  };
};

const derivedTitleAndDatePlugin: RemarkPlugin<
  [{ title: (fileStem: string) => string }]
> = ({ title }) => {
  return (_tree, file) => {
    const data = file.data as { astro: PostProps };
    const frontmatter = data.astro.frontmatter as Partial<PostFrontmatter>;

    if (!frontmatter.title) {
      frontmatter.title = title(file.stem || "");
    }

    if (!frontmatter.date) {
      
    }
  };
};

const remarkPlugins: RemarkPlugins = [
  [
    defaultLayoutPlugin,
    { layoutPath: resolve(__dirname, "./src/layouts/PostLayout.astro") },
  ],
  [derivedTitleAndDatePlugin, { title: titleCase }],
];

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins,
    extendDefaultPlugins: true,
  },
  integrations: [
    mdx({
      extendPlugins: "markdown",
      remarkPlugins: [
        // MDX integration inherits all remark plugins from markdown.remarkPlugins
      ],
    }),
  ],
});
