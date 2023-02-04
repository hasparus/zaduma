import type { JSX } from "solid-js";

import styles from "./Table.module.css";

export function Table(props: JSX.HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      {...props}
      classList={{ ...props.classList, [styles.Table!]: true }}
    />
  );
}
