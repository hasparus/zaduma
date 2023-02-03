import type { JSX } from "solid-js";

import styles from "./Blockquote.module.css";

export function Blockquote(props: JSX.BlockquoteHTMLAttributes<HTMLElement>) {
  return (
    <blockquote
      {...props}
      classList={{
        ...props.classList,
        "bg-gray-100 dark:bg-gray-800 rounded-sm py-4 px-6": true,
        [styles.Blockquote!]: true,
      }}
    />
  );
}
