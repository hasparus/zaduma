import type * as hast from "hast";
import type { Plugin } from "unified";

export const FLEX_CONTAINER_CLASS = "zaduma-aside";

export type AsidesPluginOptions = {};

/**
 * Wraps `aside` elements with previous sibling in a flex container.
 *
 * Read posts/features/asides.mdx for more information.
 */
export const asidesPlugin: Plugin<[AsidesPluginOptions], Root, Root> = (
  _options,
) => {
  return (root) => {
    let children = [...root.children];

    const childrenToRemove: Set<RootContent> = new Set();

    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (!node) continue;
      if (node.type === "mdxJsxFlowElement" && node.name === "aside") {
        let lastAsideIndex = 0;
        for (let j = i - 1; j >= lastAsideIndex; j--) {
          const prev = children[j];
          if (!prev) continue;
          if (prev.type === "element") {
            childrenToRemove.add(node);
            lastAsideIndex = i;

            children[j] = {
              type: "mdxJsxFlowElement",
              name: "div",
              position: prev.position,
              data: prev.data,
              attributes: [
                {
                  type: "mdxJsxAttribute",
                  name: "className",
                  value: FLEX_CONTAINER_CLASS,
                },
              ],
              children: [
                {
                  type: "element",
                  tagName: "div",
                  children: [prev],
                  properties: {},
                },
                node,
              ],
            };

            break;
          }
        }
      }
    }

    children = children.filter((node) => !childrenToRemove.has(node));

    return { ...root, children };
  };
};

interface RootContentMap extends hast.RootContentMap {
  mdxJsxFlowElement: MdxJsxFlowElement;
}

type RootContent = RootContentMap[keyof RootContentMap];

interface Root {
  type: "root";
  children: RootContent[];
}

interface ElementContentMap extends hast.ElementContentMap {
  mdxJsxFlowElement: MdxJsxFlowElement;
}

type ElementContent = ElementContentMap[keyof ElementContentMap];

interface MdxJsxFlowElement {
  type: "mdxJsxFlowElement";
  name: string;
  attributes: { type: "mdxJsxAttribute"; name: string; value: unknown }[];
  children: ElementContent[];
  position?:
    | undefined
    | {
        start: { line: number; column: number; offset?: number | undefined };
        end: { line: number; column: number; offset?: number | undefined };
      };
  data?: unknown;
}
