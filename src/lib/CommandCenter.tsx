import {
  children,
  createContext,
  createEffect,
  createMemo,
  createRenderEffect,
  createSelector,
  createSignal,
  createUniqueId,
  type JSX,
  onCleanup,
  Show,
  splitProps,
  useContext,
} from "solid-js";

import { Dialog, type DialogProps } from "./Dialog";

type CommandCenterCtx = {
  listId: string;
  inputId: string;
  setDialogRef: (ref: HTMLDialogElement | undefined) => void;
  open: () => void;
  isSelected: (command: string) => boolean;
  matchesFilter: (command: string) => boolean;
  onInput: (filter: string) => void;
  selectOption: (element: HTMLElement) => void;
  onSelectedUnmount: () => void;
  getInputValue: () => string;
};
const CommandCenterCtx = createContext<CommandCenterCtx>({
  inputId: "",
  listId: "",
  setDialogRef: () => {},
  open: () => {},
  isSelected: () => false,
  matchesFilter: () => true,
  onInput: () => {},
  selectOption: () => {},
  onSelectedUnmount: () => {},
  getInputValue: () => "",
});

export const useCommandCenterCtx = () => useContext(CommandCenterCtx);

export interface CommandCenterTriggerProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (event: MouseEvent) => void;
}
export function CommandCenterTrigger(props: CommandCenterTriggerProps) {
  const ctx = useCommandCenterCtx();

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
  inputId?: string;
}

export function CommandCenter(props: CommandCenterProps) {
  const dialogRef = {
    current: undefined as HTMLDialogElement | undefined,
  };
  let inputId = createUniqueId();
  const listId = createUniqueId();

  if (props.inputId) {
    inputId = props.inputId;
  }

  const [inputValue, onInput] = createSignal("");
  const [selectedCommand, selectCommand] = createSignal<string>("");
  const isSelected = createSelector(selectedCommand);

  const match = (option: string, pattern: string) => {
    return option.toLowerCase().includes(pattern.toLowerCase());
  };

  const matchesFilter = createSelector<string, string>(inputValue, match);

  const getOptions = (): HTMLElement[] =>
    Array.from(dialogRef.current?.querySelectorAll('[role="option"]') || []);

  createEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog || !dialog.open) return;

      let move: -1 | 1;

      switch (event.key) {
        case "ArrowUp":
          move = -1;
          break;

        case "ArrowDown":
          move = 1;
          break;

        default:
          return;
      }

      document.getElementById(inputId)?.focus();

      selectCommand((prev) => {
        const commands = getOptions();
        const current: HTMLElement | null = dialog.querySelector(
          '[aria-selected="true"]',
        );

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
        listId,
        inputId,
        setDialogRef: (ref) => {
          dialogRef.current = ref;

          ref?.addEventListener("close", () => {
            selectCommand("");
            onInput("");
            (document.getElementById(inputId) as HTMLInputElement).value = "";
          });
        },
        open: () => {
          dialogRef.current?.showModal();
        },
        isSelected,
        matchesFilter,
        onInput: (pattern) => {
          onInput(pattern);

          if (!match(selectedCommand(), pattern)) {
            for (const element of getOptions()) {
              const text = getCommandText(element);
              if (match(text, pattern)) {
                selectCommand(text);
                break;
              }
            }
          }
        },
        selectOption: (element) => selectCommand(getCommandText(element)),
        onSelectedUnmount: () => selectCommand(""),
        getInputValue: inputValue,
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
  const { matchesFilter } = useCommandCenterCtx();

  const kids = children(() => props.children);
  const allChildrenAreHidden = createMemo(() => {
    const ks = (Array.isArray(kids()) ? kids() : [kids()]) as HTMLElement[];

    return ks.every((element) => !matchesFilter(getCommandText(element)));
  });

  return (
    <>
      <Show when={!!props.heading}>
        <div
          aria-hidden
          id={headingId}
          style={{ display: allChildrenAreHidden() ? "none" : "" }}
        >
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

export interface CommandItemProps extends JSX.HTMLAttributes<HTMLElement> {
  children: JSX.Element;
  href?: string | undefined;
}

export function CommandItem(props: CommandItemProps) {
  const [own, rest] = splitProps(props, ["href"]);
  const { isSelected, matchesFilter, onSelectedUnmount } =
    useCommandCenterCtx();

  const res = (
    own.href ? (
      <a
        href={own.href}
        role="option"
        aria-selected="false"
        {...(rest as JSX.HTMLAttributes<HTMLAnchorElement>)}
      >
        {props.children}
      </a>
    ) : (
      <button
        type="button"
        role="option"
        aria-selected="false"
        {...(rest as JSX.HTMLAttributes<HTMLButtonElement>)}
      >
        {props.children}
      </button>
    )
  ) as HTMLElement;

  createEffect(() => {
    const text = getCommandText(res);

    const selected = isSelected(text);
    res.ariaSelected = String(selected);
    res.style.display = matchesFilter(text) ? "" : "none";

    const isVisible = matchesFilter(text);

    res.style.display = isVisible ? "" : "none";
    res.role = isVisible ? "option" : "none";

    if (selected) {
      setTimeout(
        () => res.scrollIntoView({ block: "center", behavior: "smooth" }),
        0,
      );
      onCleanup(() => {
        if (isSelected(text)) onSelectedUnmount();
      });
    }
  });

  return res;
}

export interface CommandInputProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onChange" | "id"> {
  "aria-label": string;
}

export function CommandInput(props: CommandInputProps) {
  const ctx = useCommandCenterCtx();

  return (
    <input
      autocomplete="off"
      onInput={(event) => {
        ctx.onInput(event.currentTarget.value);
      }}
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
  const ctx = useCommandCenterCtx();

  return (
    <Dialog
      {...props}
      style={{
        margin: "0 auto",
        position: "fixed",
        "max-height": "361px",
        top: "calc(50% - 180px)",
      }}
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

export function CommandList(
  props: Omit<JSX.HTMLAttributes<HTMLDivElement>, "id">,
) {
  const { listId, isSelected, selectOption } = useCommandCenterCtx();

  createRenderEffect(() => {
    const nothingSelected = isSelected("");
    const kids = children(() => props.children).toArray();

    if (nothingSelected) {
      for (const child of kids) {
        if (child instanceof HTMLElement) {
          if (child.role === "option") {
            selectOption(child);
            break;
          }

          const first: HTMLElement | null =
            child.querySelector("[role=option]");

          if (first) {
            selectOption(first);
            break;
          }
        }
      }
    }
  });

  return <div id={listId} {...props} />;
}
