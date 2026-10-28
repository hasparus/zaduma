/**
 * Override these per-site. `X_HANDLE` ships as the template author's: replace it
 * with yours or set it to `undefined`. Consumed by BaseLayout (JSON-LD WebSite),
 * llms.txt, and llms-full.txt. Consumers may extend this module with
 * an AUTHOR and thread it through PostLayout / rss.
 */
export const SITE_NAME = "Zaduma";
export const SITE_BLURB =
  "An Astro starter template for understated personal websites.";
/** Emitted as `twitter:site`. X player cards (from `img.ogVideo`) need it; without it, posts fall back to `summary_large_image`. */
export const X_HANDLE: string | undefined = "@hasparus";
