/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { JSX, splitProps } from "solid-js";

import { useFocusTrap } from "./useFocusTrap";

export interface DialogProps
  extends JSX.DialogHtmlAttributes<HTMLDialogElement> {
  open?: boolean;
  onClose?: () => void;
  children: JSX.Element;
  ref?: (dialog: HTMLDialogElement) => void;
}

export function Dialog(props: DialogProps) {
  const [own, rest] = splitProps(props, ["open", "onClose", "children", "ref"]);
  const dialogRef: { current: HTMLDialogElement | undefined } = {
    current: undefined,
  };

  useFocusTrap(dialogRef);

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
      <form
        method="dialog"
        onSubmit={() => {
          props.onClose?.();
        }}
      >
        {own.children}
      </form>
    </dialog>
  );
}

export interface DialogCloseButtonProps
  extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {}

export function DialogCloseButton(ps: DialogCloseButtonProps) {
  return <button value="cancel" {...ps} />;
}
