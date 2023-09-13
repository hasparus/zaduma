import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { valueToEstree } from "estree-util-value-to-estree";
import getReadingTime from "reading-time";
import { visit } from "unist-util-visit";

import type { PostFrontmatter, PostProps } from "../types";

const READING_TIME_IDENTIFIER: keyof PostFrontmatter = "readingTime";

/**
 * Adds `readingTime` property to frontmatter.
 *
 * Same as remark-reading-time, but assigns to `frontmatter` instead of `file.data`.
 */
export const readingTimePlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const data = file.data as { astro: PostProps };

    let text = "";

    visit(tree, ["text", "code"], (node) => {
      if ("value" in node) {
        text += node.value;
      }
    });

    data.astro.frontmatter[READING_TIME_IDENTIFIER] = getReadingTime(text);
  };
};

/**
 * Adds `export const readingTime = { ... }` to MDX files.
 *
 * Same as remark-reading-time/mdx, but reads from `frontmatter`.
 */
export const remarkMdxReadingTimePlugin: RemarkPlugin<[]> = () => {
  return function transformer(tree, file) {
    const data = file.data as { astro: PostProps };

    const readingTime = data.astro.frontmatter.readingTime;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (readingTime === undefined) return;

    tree.children.unshift({
      type: "mdxjsEsm" as any /* tree should be typed as MDX root, not MD root */,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExportNamedDeclaration",
              source: null,
              specifiers: [],
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: READING_TIME_IDENTIFIER },
                    init: valueToEstree(readingTime),
                  },
                ],
              },
            },
          ],
        },
      },
    });
  };
};
