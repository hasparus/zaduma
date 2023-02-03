import type { JSX } from "solid-js";

import styles from "./code-and-pre.module.css";

export function Code(props: JSX.HTMLAttributes<HTMLElement>) {
  return (
    <code {...props} classList={{ ...props.classList, [styles.Code!]: true }} />
  );
}

export function Pre(props: JSX.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre {...props} classList={{ ...props.classList, [styles.Pre!]: true }} />
  );
}
