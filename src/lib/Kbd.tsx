import { createEffect, JSX } from "solid-js";

import { parseKeys } from "./parseKeys";

export interface KbdProps extends JSX.HTMLAttributes<HTMLElement> {
  code?: string;
}

export function Kbd(props: KbdProps) {
  let ref!: HTMLElement;

  createEffect(() => {
    return setDataPressedOnKeyDown(props, ref);
  });

  return (
    <kbd
      ref={ref}
      {...props}
      class={
        "rounded-md border border-b-2 bg-gray-50 p-1" +
        " dark:border-gray-700 dark:bg-gray-800" +
        " text-xs leading-none tracking-tighter" +
        " group-hover:border-b group-hover:shadow-[inset_0_1px_1px_0_rgba(0,0,0,0.025)] group-focus:outline" +
        " [&[data-pressed]] [&[data-pressed]]:border-b" +
        (props.class ? ` ${props.class}` : "")
      }
    />
  );
}

function setDataPressedOnKeyDown(props: KbdProps, ref: HTMLElement) {
  const onKeyDown = (event: KeyboardEvent) => {
    if (currentKeyPressed(props, event)) ref.setAttribute("data-pressed", "");
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (currentKeyPressed(props, event)) ref.removeAttribute("data-pressed");
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
}

function currentKeyPressed(props: KbdProps, event: KeyboardEvent) {
  const { code, key } = parseKeys(event);
  const children = props.children;

  return (
    props.code === code ||
    (typeof children === "string" && [code, key].includes(children.trim()))
  );
}
