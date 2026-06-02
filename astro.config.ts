import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { transformerTwoslash } from "@shikijs/twoslash";
import { defineConfig, envField } from "astro/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { rehypePlugins, remarkPlugins } from "./src/build-time";
import { getHiddenPostPaths } from "./src/build-time/hiddenPostPaths";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const hostname = "zaduma.vercel.app";
const site = `https://${hostname}/`;

const stripTrailingSlash = (path: string) => path.replace(/\/+$/, "") || "/";

const isProd = process.env.NODE_ENV === "production";
const hiddenPaths = getHiddenPostPaths(resolve(__dirname, "./posts"), {
  isProd,
});

export default defineConfig({
  site,
  env: {
    schema: {
      OG_IMAGE_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      transformers: [
        transformerTwoslash({
          explicitTrigger: true,
          twoslashOptions: {
            compilerOptions: {
              strict: true,
              module: 199,
              moduleResolution: 99,
              target: 99,
              types: ["node"],
            },
          },
        }),
      ],
    },
    gfm: true,
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx({
      extendMarkdownConfig: true,
      remarkPlugins: remarkPlugins(__dirname),
      rehypePlugins: rehypePlugins,
    }),
    solidJs(),
    sitemap({
      filter: (page) =>
        !hiddenPaths.has(stripTrailingSlash(new URL(page).pathname)),
    }),
  ],
  vite: {
    ssr: {
      noExternal: [
        "@fontsource-variable/inter",
        "@fontsource-variable/brygada-1918",
      ],
    },
    define: {
      "import.meta.env.PUBLIC_URL": JSON.stringify(makePublicURL()),
    },
  },
});

function makePublicURL() {
  const VERCEL_URL = process.env.VERCEL_URL;
  const DEPLOYMENT_ALIAS = process.env.DEPLOYMENT_ALIAS;

  if (VERCEL_URL) return VERCEL_URL;

  if (!DEPLOYMENT_ALIAS) {
    return "http://localhost:3000/";
  }

  if (DEPLOYMENT_ALIAS === `main--${hostname}`) return site;

  return `https://${DEPLOYMENT_ALIAS}`;
}
