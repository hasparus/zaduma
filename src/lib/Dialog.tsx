/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { JSX, splitProps } from "solid-js";

export interface DialogProps
  extends JSX.DialogHtmlAttributes<HTMLDialogElement> {
  open?: boolean;
  onClose?: () => void;
  children: JSX.Element;
}

export function Dialog(props: DialogProps) {
  const [own, rest] = splitProps(props, ["open", "onClose", "children"]);

  const dismissOnBackdropClick: JSX.EventHandler<
    HTMLDialogElement,
    MouseEvent
  > = (event) => {
    console.log("click");
    if (event.target === event.currentTarget) {
      event.currentTarget.close("dismiss");
      props.onClose?.();
    }
  };

  return (
    <dialog onClick={dismissOnBackdropClick} {...rest}>
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
