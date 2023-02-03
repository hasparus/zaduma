import type { JSX } from "solid-js";

import styles from "./Ul.module.css";

export function Ul(props: JSX.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul {...props} classList={{ ...props.classList, [styles.Ul!]: true }} />
  );
}
