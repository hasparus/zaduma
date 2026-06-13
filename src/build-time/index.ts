import type { RehypePlugins, RemarkPlugins } from "@astrojs/markdown-remark";
import { resolve } from "node:path";
import remarkSupersub from "remark-supersub";
import type { Pluggable } from "unified";

import { titleCase } from "../lib/titleCase";

import { asidesPlugin } from "./asidesPlugin";
import { derivedTitleAndDatePlugin } from "./derivedTitleAndDatePlugin";
import {
  readingTimePlugin,
  remarkMdxReadingTimePlugin,
} from "./readingTimePlugin";
import { urlOutsideOfPagesDirPlugin } from "./urlOutsideOfPagesDirPlugin";

export const remarkPlugins = (projectDir: string): RemarkPlugins => {
  return checkOptions(
    [
      urlOutsideOfPagesDirPlugin,
      { absoluteDirPath: resolve(projectDir, "./posts") },
    ],
    [derivedTitleAndDatePlugin, { title: titleCase }],
    remarkSupersub,
    readingTimePlugin,
    remarkMdxReadingTimePlugin,
  ) as RemarkPlugins;
};

export const rehypePlugins: RehypePlugins = checkOptions([
  asidesPlugin,
  {},
]) as RehypePlugins;

/**
 * Adds autocomplete and typechecking to plugin tuples.
 */
function checkOptions<TPlugins extends Pluggable[]>(
  ...p: {
    [I in keyof TPlugins]: TPlugins[I] extends [
      infer TPlugin extends (...args: never[]) => unknown,
      unknown,
    ]
      ? [TPlugin, ...Parameters<TPlugin>]
      : TPlugins[I];
  }
) {
  return p;
}
