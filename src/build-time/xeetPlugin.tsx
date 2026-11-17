import type { Post, Xeet } from "@xeet/core";
import { loadXeet } from "@xeet/core/node";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { Root, RootContent } from "mdast";
import type { Plugin } from "unified";

export type XeetPluginOptions = {
  /** Where post snapshots live, one `<id>.json` per X post. Commit them. */
  snapshotsDir: string;
  /** Where rendered PNGs go. They are rebuilt from snapshots when missing. */
  rendersDir: string;
  /** Absolute path to the component that shows the rendered images. */
  component: string;
};

/**
 * Turns a paragraph with nothing but a link to an X post into a picture of
 * that post, rendered at build time by xeet (https://xeet-rs.vercel.app).
 *
 * Read posts/features/xeet/index.mdx for more information.
 */
export const xeetPlugin: Plugin<[XeetPluginOptions], Root> = (options) => {
  return async (tree, file) => {
    // The plugin adds `import` statements, which only MDX understands.
    if (!file.path.endsWith(".mdx")) return;

    const embeds = tree.children.flatMap((node, index) => {
      const url = xPostUrlOf(node);
      return url ? [{ index, ...url }] : [];
    });
    if (embeds.length === 0) return;

    const xeet = await loadXeet({ lazy: true });
    const imports: [local: string, path: string][] = [];

    for (const [n, { index, url, id }] of embeds.entries()) {
      const post = await readOrFetchSnapshot(xeet, options, url, id, file.path);
      const images = await renderPost(xeet, options, post, id);

      const attributes = Object.entries(images).map(([name, path]) => {
        const identifier = `__xeet${n}_${name}`;
        imports.push([identifier, path]);
        return expressionAttribute(name, identifier);
      });

      tree.children[index] = {
        type: "mdxJsxFlowElement",
        name: XEET_COMPONENT,
        attributes: [
          { type: "mdxJsxAttribute", name: "url", value: url },
          { type: "mdxJsxAttribute", name: "alt", value: altTextOf(post) },
          ...attributes,
        ],
        children: [],
      } as unknown as RootContent;
    }

    imports.push([XEET_COMPONENT, options.component]);
    tree.children.unshift(
      ...imports.map(([local, path]) => importNode(local, path)),
    );
  };
};

const XEET_COMPONENT = "XeetEmbed";

/** Widths in CSS pixels. The narrow one is for phones. */
const XEET_WIDTHS = { wide: 600, narrow: 390 } as const;

const X_POST_URL =
  /^https:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/\w{1,15}\/status\/(\d+)\/?(?:[?#].*)?$/;

/** A paragraph that holds only a link to an X post, as `https://x.com/…` or `<https://x.com/…>`. */
function xPostUrlOf(node: RootContent) {
  if (node.type !== "paragraph" || node.children.length !== 1) return null;
  const [link] = node.children;
  if (link?.type !== "link" || link.children.length !== 1) return null;
  const [text] = link.children;
  if (text?.type !== "text" || text.value !== link.url) return null;

  const id = X_POST_URL.exec(link.url)?.[1];
  return id ? { url: link.url, id } : null;
}

async function readOrFetchSnapshot(
  xeet: Xeet,
  { snapshotsDir }: XeetPluginOptions,
  url: string,
  id: string,
  postFile: string,
): Promise<Post> {
  const path = join(snapshotsDir, `${id}.json`);
  const shown = relative(process.cwd(), path);
  if (existsSync(path)) {
    try {
      return JSON.parse(readFileSync(path, "utf8")) as Post;
    } catch (error) {
      throw new Error(`${shown} is not valid JSON`, { cause: error });
    }
  }

  let post: Post;
  try {
    ({ post } = await xeet.resolve(url, { media: true }));
  } catch (error) {
    throw new Error(
      `Could not fetch ${url} (embedded in ${relative(process.cwd(), postFile)}). ` +
        `Build once where x.com is reachable and commit ${shown}, ` +
        `or write it by hand: { "text": "…", "author": { "name": "…", "handle": "…" } }.`,
      { cause: error },
    );
  }
  mkdirSync(snapshotsDir, { recursive: true });
  writeFileSync(path, JSON.stringify(post, null, 2) + "\n");
  // eslint-disable-next-line no-console -- the author has to act on this
  console.warn(`[xeet] Saved ${shown}. Commit it, so builds don't hit x.com.`);
  return post;
}

/** Renders the post in both themes and both widths, and returns the PNG paths. */
async function renderPost(
  xeet: Xeet,
  { rendersDir }: XeetPluginOptions,
  post: Post,
  id: string,
) {
  const variants = {
    light: { theme: "light", width: XEET_WIDTHS.wide },
    lightNarrow: { theme: "light", width: XEET_WIDTHS.narrow },
    dark: { theme: "dark", width: XEET_WIDTHS.wide },
    darkNarrow: { theme: "dark", width: XEET_WIDTHS.narrow },
  } as const;
  const optionsList = Object.values(variants).map((variant) => ({
    ...variant,
    surface: "web-timeline" as const,
    dpr: 2,
    expanded: true,
  }));

  // The name changes when the post, the options or xeet change, so a stale
  // render is never reused, and an existing file is never rewritten.
  const hash = createHash("sha256")
    .update(xeet.upstream)
    .update(JSON.stringify(optionsList))
    .update(JSON.stringify(post))
    .digest("hex")
    .slice(0, 12);
  const paths = Object.keys(variants).map((name) =>
    join(rendersDir, `${id}-${hash}-${name}.png`),
  );

  if (!paths.every((path) => existsSync(path))) {
    await xeet.ensureFonts?.({ post });
    const renders = xeet.renderMany(post, optionsList);
    mkdirSync(rendersDir, { recursive: true });
    for (const [i, { png }] of renders.entries()) writeFileSync(paths[i]!, png);
  }

  return Object.fromEntries(
    Object.keys(variants).map((name, i) => [name, paths[i]!]),
  ) as Record<keyof typeof variants, string>;
}

/** What the picture says, for screen readers and search engines. */
export function altTextOf(post: Post): string {
  const { name, handle } = post.author ?? {};
  const author =
    name && handle ? `${name} (@${handle})` : name || (handle && `@${handle}`);
  const parts = [`${author || "A post"} on X: ${post.text}`];
  for (const media of post.media ?? []) {
    parts.push(media.alt ? `[${media.kind}: ${media.alt}]` : `[${media.kind}]`);
  }
  if (post.quote) parts.push(`Quoting ${altTextOf(post.quote)}`);
  return parts.join(" ");
}

function expressionAttribute(name: string, identifier: string) {
  return {
    type: "mdxJsxAttribute",
    name,
    value: {
      type: "mdxJsxAttributeValueExpression",
      value: identifier,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExpressionStatement",
              expression: { type: "Identifier", name: identifier },
            },
          ],
        },
      },
    },
  };
}

function importNode(local: string, path: string): RootContent {
  const raw = JSON.stringify(path);
  return {
    type: "mdxjsEsm",
    value: `import ${local} from ${raw};`,
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [
          {
            type: "ImportDeclaration",
            specifiers: [
              {
                type: "ImportDefaultSpecifier",
                local: { type: "Identifier", name: local },
              },
            ],
            source: { type: "Literal", value: path, raw },
          },
        ],
      },
    },
  } as unknown as RootContent;
}
