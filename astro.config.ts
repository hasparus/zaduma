import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { rehypePlugins, remarkPlugins } from "./src/build-time";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Production URL
const hostname = "incomparable-raindrop-37b18f.netlify.app"; // Change this to your actual Netlify app URL
const site = `https://${hostname}/`;

// https://astro.build/config
export default defineConfig({
  site,
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    mdx({
      extendMarkdownConfig: true,
      // MDX integration inherits all remark plugins from markdown.remarkPlugins
      remarkPlugins: remarkPlugins(__dirname),
      rehypePlugins: rehypePlugins,
    }),
    solidJs(),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
  ],
  vite: {
    ssr: {
      noExternal: ["@fontsource/inter", "@fontsource/brygada-1918"],
    },
    define: {
      "import.meta.env.PUBLIC_URL": JSON.stringify(makePublicURL()),
    },
  },
});

function makePublicURL() {
  const NETLIFY_URL = process.env.URL;

  // If the site is built on Netlify, we can just use NETLIFY_URL.
  if (NETLIFY_URL) return NETLIFY_URL;

  // If there's no NETLIFY_URL, we assume we're building locally.
  return "http://localhost:3000/";
}
