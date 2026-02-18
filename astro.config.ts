import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { transformerTwoslash } from "@shikijs/twoslash";
import { defineConfig, envField } from "astro/config";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { rehypePlugins, remarkPlugins } from "./src/build-time";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

// Production URL
const hostname = "zaduma.vercel.app";
const site = `https://${hostname}/`;

// https://astro.build/config
export default defineConfig({
  site,
  env: {
    schema: {
      OG_IMAGE_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      PUBLIC_URL: envField.string({
        context: "client",
        access: "public",
        default: "http://localhost:3000/",
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
              module: 199 /* NodeNext */,
              moduleResolution: 99 /* NodeNext */,
              target: 99 /* ESNext */,
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
      // MDX integration inherits all remark plugins from markdown.remarkPlugins
      remarkPlugins: remarkPlugins(__dirname),
      rehypePlugins: rehypePlugins,
    }),
    solidJs(),
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

  // If the site is built on vercel, we can just use VERCEL_URL.
  if (VERCEL_URL) return VERCEL_URL;

  if (!DEPLOYMENT_ALIAS) {
    // If there's no DEPLOYMENT_ALIAS nor VERCEL_URL, we assume we're building locally.
    return "http://localhost:3000/";
  }

  // Otherwise, we build on GitHub Actions (and get access to Git History).
  // If DEPLOYMENT_ALIAS is set to `main--${hostname}`, we're on the main branch,
  // and we return the canonical URL.
  if (DEPLOYMENT_ALIAS === `main--${hostname}`) return site;

  // Otherwise, we're building a preview deployment, and set the deployment alias
  // in `import.meta.env.PUBLIC_URL`.
  return `https://${DEPLOYMENT_ALIAS}`;
}
