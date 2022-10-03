import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import type { RemarkPlugins } from "astro";
import { defineConfig } from "astro/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  defaultLayoutPlugin,
  derivedTitleAndDatePlugin,
} from "./src/build-time";
import { urlOutsideOfPagesDirPlugin } from "./src/build-time/urlOutsideOfPagesDirPlugin";
import { titleCase } from "./src/lib/titleCase";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const remarkPlugins: RemarkPlugins = [
  [
    defaultLayoutPlugin,
    { layoutPath: resolve(__dirname, "./src/layouts/PostLayout.astro") },
  ],
  [
    urlOutsideOfPagesDirPlugin,
    { absoluteDirPath: resolve(__dirname, "./posts") },
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
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    mdx({
      extendPlugins: "markdown",
      remarkPlugins: [
        // MDX integration inherits all remark plugins from markdown.remarkPlugins
      ],
    }),
    solidJs(),
  ],
});
