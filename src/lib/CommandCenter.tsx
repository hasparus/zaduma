import { createSignal } from "solid-js";

import { Dialog } from "./Dialog";

interface CommandCenterTriggerProps {
  onClick: () => void;
}
function CommandCenterTrigger(props: CommandCenterTriggerProps) {
  return (
    <button
      class="zaduma-hover-before w-12 h-12 -mx-2 rounded-sm"
      onClick={props.onClick}
    >
      ⌘
    </button>
  );
}

export function CommandCenter() {
  let dialogRef!: HTMLDialogElement;

  return (
    <>
      <CommandCenterTrigger onClick={() => dialogRef.showModal()} />
      <Dialog ref={dialogRef}>Hello</Dialog>
    </>
  );
}
