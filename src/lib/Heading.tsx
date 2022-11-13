/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable jsx-a11y/heading-has-content */

import { Show, splitProps } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { Dynamic } from "solid-js/web";

import styles from "./Heading.module.css";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
}

export function Heading(props: HeadingProps) {
  const [own, rest] = splitProps(props, ["level", "children", "classList"]);

  return (
    <Dynamic<HeadingLevel>
      component={own.level}
      classList={{
        ...own.classList,
        [styles.Heading!]: true,
      }}
      {...rest}
    >
      <Show when={rest.id} fallback={own.children}>
        <a href={"#" + rest.id!}>{own.children}</a>
      </Show>
    </Dynamic>
  );
}

export function createHeading(level: HeadingLevel) {
  return (props: Omit<HeadingProps, "level">) => (
    <Heading level={level} {...props} />
  );
}
