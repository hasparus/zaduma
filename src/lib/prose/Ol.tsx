import type { JSX } from "solid-js/jsx-runtime";

import styles from "./Ol.module.css";

export interface OlProps extends JSX.HTMLAttributes<HTMLOListElement> {
  style: JSX.CSSProperties;
}

export function Ol(props: OlProps) {
  return (
    <ol
      {...props}
      classList={{ ...props.classList, [styles.Ol!]: true }}
      style={{
        ...props.style,
        "--start": (props as { start?: number | string }).start || 0,
      }}
    />
  );
}
