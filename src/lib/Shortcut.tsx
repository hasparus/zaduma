import type { JSX } from "solid-js";
import { For } from "solid-js";

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
      <For each={props.shortcut.split("+")}>
        {(key) => {
          let style = "";

          if (!IS_MAC && key === "cmd") {
            key = "ctrl";
          } else if (key === "shift") {
            style = "font-family: Inter";
            key = "⇧";
          } else if (key === "slash") {
            key = "/";
          }

          return <Kbd style={style}>{key}</Kbd>;
        }}
      </For>
    </span>
  );
}
