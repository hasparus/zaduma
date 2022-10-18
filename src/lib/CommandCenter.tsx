import {
  createContext,
  createEffect,
  createSelector,
  createSignal,
  createUniqueId,
  JSX,
  onCleanup,
  Show,
  useContext,
} from "solid-js";

import { Dialog, DialogProps } from "./Dialog";

type CommandCenterCtx = {
  listId: string;
  inputId: string;
  setDialogRef: (ref: HTMLDialogElement | undefined) => void;
  open: () => void;
  isSelected: (command: string) => boolean;
};
const CommandCenterCtx = createContext<CommandCenterCtx>({
  listId: "",
  inputId: "",
  setDialogRef: () => {},
  open: () => {},
  isSelected: () => false,
});

const useCtx = () => useContext(CommandCenterCtx);

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

  const [selectedCommand, selectCommand] = createSignal<string>("");
  const isSelected = createSelector(selectedCommand);

  createEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      let move: -1 | 1;

      switch (event.key) {
        // case 'ArrowDown'
        case "ArrowUp":
        case "k":
          move = -1;
          break;

        case "ArrowDown":
        case "j":
          move = 1;
          break;

        default:
          return;
      }

      selectCommand((prev) => {
        const commands: HTMLElement[] = Array.from(
          dialog.querySelectorAll('[role="option"]')
        );
        const current = dialog.querySelector(
          '[aria-selected="true"]'
        ) as HTMLElement;

        if (!current) {
          const next = move === 1 ? commands[0] : commands.at(-1);
          if (!next) return prev;
          return getCommandText(next);
        }

        const index = commands.indexOf(current);
        const nextIndex = (index + move + commands.length) % commands.length;

        return getCommandText(commands[nextIndex]!);
      });
    };

    window.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      window.removeEventListener("keydown", onKeyDown);
    });
  });

  return (
    <CommandCenterCtx.Provider
      value={{
        inputId,
        listId,
        setDialogRef: (ref) => {
          dialogRef.current = ref;
        },
        open: () => {
          dialogRef.current?.showModal();
        },
        isSelected,
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
    <>
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
    </>
  );
}

export interface CommandItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
}

export function CommandItem(props: CommandItemProps) {
  const { isSelected } = useCtx();

  const res = (
    <div role="option" aria-selected="false" {...props}>
      {props.children}
    </div>
  ) as HTMLElement;

  createEffect(() => {
    res.ariaSelected = String(isSelected(getCommandText(res)));
  });

  return res;
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
  const ctx = useCtx();

  return (
    <Dialog
      {...props}
      ref={(dialog) => {
        ctx.setDialogRef(dialog);
        props.ref?.(dialog);
      }}
    />
  );
}

function getCommandText(element: HTMLElement) {
  return element.textContent || element.innerText;
}
