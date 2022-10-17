import { JSX, splitProps } from "solid-js";

export interface KbdProps extends JSX.HTMLAttributes<HTMLElement> {}

export function Kbd(props: KbdProps) {
  const [own, rest] = splitProps(props, ["class"]);

  return (
    <kbd
      {...rest}
      class={
        "p-1 border border-b-2 rounded-md bg-gray-50" +
        " dark:border-gray-700 dark:bg-gray-800" +
        " tracking-tighter leading-none text-xs" +
        (own.class ? ` ${own.class}` : "")
      }
    />
  );
}
