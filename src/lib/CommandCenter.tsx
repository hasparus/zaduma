import {
  createContext,
  createSelector,
  createSignal,
  createUniqueId,
  JSX,
  Show,
  useContext,
} from "solid-js";

import { Dialog, DialogProps } from "./Dialog";
import { useFocusTrap } from "./useFocusTrap";

type CommandCenterCtx = {
  listId: string;
  inputId: string;
  setDialogRef: (ref: HTMLDialogElement | undefined) => void;
  open: () => void;
};
const CommandCenterCtx = createContext<CommandCenterCtx>();

const useCtx = () => useContext(CommandCenterCtx)!;

export interface CommandCenterTriggerProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (event: MouseEvent) => void;
}
export function CommandCenterTrigger(props: CommandCenterTriggerProps) {
  const ctx = useCtx();

  return (
    <button
      {...props}
      onClick={(event) => {
        ctx.open();
        props.onClick?.(event);
      }}
    >
      ⌘
    </button>
  );
}

export interface CommandCenterProps {
  children: JSX.Element;
}

export function CommandCenter(props: CommandCenterProps) {
  const dialogRef = {
    current: undefined as HTMLDialogElement | undefined,
  };
  const inputId = createUniqueId();
  const listId = createUniqueId();

  const [selectedId, selectId] = createSignal<string>("");
  const isSelected = createSelector(selectedId);

  useFocusTrap(dialogRef);

  return (
    <CommandCenterCtx.Provider
      value={{
        inputId,
        listId,
        setDialogRef: (ref) => {
          dialogRef.current = ref;
        },
        open: () => dialogRef.current?.showModal(),
      }}
    >
      {props.children}
    </CommandCenterCtx.Provider>
  );
}

export interface CommandGroupProps {
  heading?: JSX.Element;
  children: JSX.Element;
}

export function CommandGroup(props: CommandGroupProps) {
  const headingId = createUniqueId();

  return (
    <div>
      <Show when={!!props.heading}>
        <div aria-hidden id={headingId}>
          {props.heading}
        </div>
      </Show>
      <div
        role="group"
        {...(props.heading && { "aria-labelledby": headingId })}
      >
        {props.children}
      </div>
    </div>
  );
}

export interface CommandItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
}

export function CommandItem(props: CommandItemProps) {
  // TODO:
  const selected = false;

  return (
    <div role="option" aria-selected {...props}>
      {props.children}
    </div>
  );
}

export interface CommandInputProps
  extends JSX.InputHTMLAttributes<HTMLInputElement> {
  "aria-label": string;
}

export function CommandInput(props: CommandInputProps) {
  const ctx = useCtx();

  return (
    <input
      autocomplete="off"
      {...{
        /**
         * Safari only
         * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocorrect
         */
        autocorrect: "off",
      }}
      spellcheck={false}
      aria-autocomplete="list"
      role="combobox"
      aria-expanded={true}
      aria-controls={ctx.listId}
      id={ctx.inputId}
      type="text"
      {...props}
    />
  );
}

export interface CommandCenterDialogProps extends DialogProps {
  ref?: (ref: HTMLDialogElement | undefined) => void;
}

export function CommandCenterDialog(props: CommandCenterDialogProps) {
  const { setDialogRef } = useContext(CommandCenterCtx)!;

  return (
    <Dialog
      {...props}
      ref={(dialog) => {
        setDialogRef(dialog);
        props.ref?.(dialog);
      }}
    />
  );
}
