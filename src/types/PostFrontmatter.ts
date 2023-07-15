import type { ReadTimeResults } from "reading-time";

export interface PostFrontmatter {
  description: string;

  tags: string[];
  /**
   * Optional URL to a picture.
   */
  img?: string;
  /**
   * Optional URL to og:image if it's premade, not created by /api/og.ts.
   */
  ogImage?: string;
  /**
   * @computed by derivedTitleAndDatePlugin from file name
   *           if not given
   */
  title: string;
  /**
   * @computed by derivedTitleAndDatePlugin from git commit time
   *           if not given
   */
  date: string;
  /**
   * @computed by defaultLayoutPlugin
   */
  layout?: string;
  /**
   * @computed by urlOutsideOfPagesDirPlugin
   */
  path: string;
  /**
   * @computed by readingTimePlugin
   * @example
   * {
   *   text: '1 min read',
   *   minutes: 1,
   *   time: 60000,
   *   words: 200
   * }
   */
  readingTime: ReadTimeResults;
  draft?: boolean;
}
