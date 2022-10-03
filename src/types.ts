import type { MarkdownHeading, MarkdownLayoutProps } from "astro";

export interface PostFrontmatter {
  layout?: string;
  title: string;
  date: Date;
}

interface BasePostProps {
  file: string;
  // this would be undefined for markdown files outside of `src/pages`, but
  // we are not going to have those.
  url: string;
  frontmatter: PostFrontmatter;
}

/** @see https://docs.astro.build/en/guides/markdown-content/#markdown-layout-props */
type MarkdownPostProps = Omit<MarkdownLayoutProps<{}>, "frontmatter">;

/** @see https://docs.astro.build/en/guides/integrations-guide/mdx/#exported-properties */
type MDXPostProps = {
  getHeadings: () => MarkdownHeading[];
};

export type PostProps = BasePostProps & (MarkdownPostProps | MDXPostProps);
