import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import mdx from "@astrojs/mdx";
import type { RemarkPlugins } from "astro";

import { titleCase } from "./src/lib/titleCase";
import {
  defaultLayoutPlugin,
  derivedTitleAndDatePlugin,
} from "./src/build-time";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
