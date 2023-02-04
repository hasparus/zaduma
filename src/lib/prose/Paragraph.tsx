import type { JSX } from "solid-js";

import styles from "./Paragraph.module.css";

export function Paragraph(props: JSX.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} classList={{ [styles.Paragraph!]: true }} />;
}
