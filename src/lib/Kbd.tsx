import { createEffect, type JSX } from "solid-js";

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
        "p-1 border border-b-2 rounded-md bg-gray-50" +
        " dark:border-gray-700 dark:bg-gray-800" +
        " tracking-tighter leading-none text-xs" +
        " group-hover:border-b group-hover:shadow-[inset_0_1px_1px_0_rgba(0,0,0,0.025)] group-focus:outline" +
        " [&[data-pressed]]:border-b [&[data-pressed]]" +
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
