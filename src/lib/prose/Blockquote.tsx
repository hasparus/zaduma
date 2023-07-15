import type { JSX } from "solid-js";

import styles from "./Blockquote.module.css";

export function Blockquote(props: JSX.BlockquoteHTMLAttributes<HTMLElement>) {
  return (
    <blockquote
      {...props}
      classList={{
        ...props.classList,
        "bg-background rounded-sm py-4 px-6": true,
        [styles.Blockquote!]: true,
      }}
    />
  );
}
