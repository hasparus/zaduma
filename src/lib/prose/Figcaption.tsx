import type { JSX } from "solid-js";

import styles from "./Figcaption.module.css";

export function Figcaption(props: JSX.HTMLAttributes<HTMLElement>) {
  return (
    <figcaption
      {...props}
      classList={{
        ...props.classList,
        "px-6 text-gray-600 dark:text-gray-400": true,
        [styles.Figcaption!]: true,
      }}
    />
  );
}
