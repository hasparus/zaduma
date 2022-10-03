// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import mdx from "@astrojs/mdx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
});
