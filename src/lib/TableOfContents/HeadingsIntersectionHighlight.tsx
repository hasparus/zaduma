import type { MarkdownHeading } from "astro";
import { createEffect, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";

export interface HeadingsIntersectionHighlightProps {
  headings: Pick<MarkdownHeading, "slug">[];
}

export function HeadingsIntersectionHighlight(
  props: HeadingsIntersectionHighlightProps,
) {
  const toc = !isServer && document.getElementById("table-of-contents")!;
  let current: HTMLAnchorElement | undefined;

  const highlightTocItem = (anchor: HTMLAnchorElement | null) => {
    if (!anchor) return;
    if (current) current.ariaCurrent = null;
    anchor.ariaCurrent = "true";
    current = anchor;
  };

  const observer =
    globalThis.IntersectionObserver === undefined
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries = entries.filter((e) => e.isIntersecting);
            if (entries.length === 0) return;

            let max = entries[0]!;
            for (const entry of entries) {
              if (entry.intersectionRatio > max.intersectionRatio) max = entry;
            }

            if (toc) {
              highlightTocItem(
                toc.querySelector<HTMLAnchorElement>(
                  `a[href="#${max.target.id}"]`,
                ),
              );
            }
          },
          { threshold: 1, rootMargin: "-15% 0% -55% 0%" },
        );

  createEffect(() => {
    for (const heading of props.headings) {
      const element = document.getElementById(heading.slug);
      if (element) {
        observer!.observe(element);
      }
    }

    onCleanup(() => {
      observer!.disconnect();
    });
  });

  return null;
}
