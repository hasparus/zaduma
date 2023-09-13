/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { createEffect, type JSX, splitProps } from "solid-js";

import { useFocusTrap } from "./useFocusTrap";

export interface DialogProps
  extends JSX.DialogHtmlAttributes<HTMLDialogElement> {
  open?: boolean;
  onClose?: () => void;
  children: JSX.Element;
  ref?: (dialog: HTMLDialogElement) => void;
}

export function Dialog(props: DialogProps) {
  const [own, rest] = splitProps(props, ["children", "ref"]);
  const dialogRef: { current: HTMLDialogElement | undefined } = {
    current: undefined,
  };

  useFocusTrap(dialogRef);

  createEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      const observer = new MutationObserver(() => {
        document.body.style.overflow = dialog.open ? "hidden" : "";
      });

      observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    }
  });

  const dismissOnBackdropClick: JSX.EventHandler<
    HTMLDialogElement,
    MouseEvent
  > = (event) => {
    if (event.target === event.currentTarget) {
      event.currentTarget.close("dismiss");
      props.onClose?.();
    }
  };

  return (
    <dialog
      onClick={dismissOnBackdropClick}
      ref={(dialog) => {
        dialogRef.current = dialog;
        own.ref?.(dialog);
      }}
      {...rest}
    >
      {own.children}
    </dialog>
  );
}

export interface DialogCloseButtonProps
  extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {}

export function DialogCloseButton(props: DialogCloseButtonProps) {
  return (
    <button
      onClick={(event) => {
        event.currentTarget.closest("dialog")?.close("dismiss");
      }}
      {...props}
    />
  );
}
