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
    typeof globalThis.IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          (entries) => {
            entries = entries.filter((e) => e.isIntersecting);
            if (entries.length === 0) return;

            const max = entries.reduce((acc, val) =>
              val.intersectionRatio > acc.intersectionRatio ? val : acc,
            );

            if (toc) {
              highlightTocItem(
                toc.querySelector<HTMLAnchorElement>(
                  `a[href="#${max.target.id}"]`,
                ),
              );
            }
          },
          { threshold: 1, rootMargin: "-15% 0% -55% 0%" },
        )
      : null;

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
  }, [props.headings]);

  return null;
}
