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

const site = "https://zaduma.vercel.app/";

console.log(
  "env vars in astro.config.ts",
  `
    process.env.env.VERCEL_URL=${process.env.VERCEL_URL},
    process.env.env.DEPLOYMENT_ALIAS=${process.env.DEPLOYMENT_ALIAS},
    process.env.env.DEV=${process.env.DEV},
    process.env.NODE_ENV=${process.env.NODE_ENV},
  `
);

// https://astro.build/config
export default defineConfig({
  site,
  markdown: {
    extendDefaultPlugins: true,
    // We'll highlight using Shiki Twoslash remark plugin
    syntaxHighlight: false,
  },
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    mdx({
      // MDX integration inherits all remark plugins from markdown.remarkPlugins
      extendPlugins: "markdown",
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
      "import.meta.env.PUBLIC_URL": JSON.stringify(
        import.meta.env.VERCEL_URL ||
          (import.meta.env.DEV
            ? "http://localhost:3000/"
            : import.meta.env.DEPLOYMENT_ALIAS
            ? `https://${import.meta.env.DEPLOYMENT_ALIAS}/`
            : site)
      ),
    },
  },
});
