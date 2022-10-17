import type { JSX } from "solid-js";

import { isMac } from "./isMac";
import { Kbd } from "./Kbd";

export interface ShortcutProps extends JSX.HTMLAttributes<HTMLElement> {
  shortcut: string;
}

export function Shortcut(props: ShortcutProps) {
  // This component cannot be used on serverside;
  const IS_MAC = typeof window !== "undefined" && isMac();

  return (
    <span
      {...props}
      classList={{
        ...props.classList,
        "inline-flex gap-1": true,
      }}
    >
      {props.shortcut.split("+").map((key) => {
        let style = "";

        if (!IS_MAC && key === "cmd") {
          key = "ctrl";
        }

        if (key === "shift") {
          style = "font-family: Inter";
          key = "⇧";
        }

        return <Kbd style={style}>{key}</Kbd>;
      })}
    </span>
  );
}
