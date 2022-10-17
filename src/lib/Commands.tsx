import {
  createEffect,
  createSignal,
  JSX,
  Match,
  onCleanup,
  onMount,
  splitProps,
  Switch,
} from "solid-js";

import { ColorScheme, setScheme } from "./color-scheme";
import {
  CommandCenter,
  CommandCenterDialog,
  CommandCenterTrigger,
  CommandGroup,
  CommandInput,
  CommandItem as CommandCenterItem,
  CommandItemProps as CommandCenterItemProps,
} from "./CommandCenter";
import { DialogCloseButton } from "./Dialog";
import { isMac } from "./isMac";
import { Kbd } from "./Kbd";
import { Shortcut } from "./Shortcut";

export function Commands() {
  const [page, setPage] = createSignal<undefined | "theme">();
  let dialog: HTMLDialogElement | undefined;

  const setColorScheme = (scheme: ColorScheme) => {
    if (page() !== "theme") return;
    setScheme(scheme);
    setPage(undefined);
    dialog?.close();
  };

  const keybindings = new Map<string, () => void>([
    ["backspace", () => setPage(undefined)],
    [
      "alt+t",
      () => {
        if (dialog && !dialog.open) dialog.showModal();
        setPage("theme");
      },
    ],
    [
      "cmd+k",
      () => {
        if (dialog) {
          if (dialog.open) dialog.close();
          else dialog.showModal();
        }
      },
    ],
    ["1", () => setColorScheme("light")],
    ["2", () => setColorScheme("dark")],
    ["3", () => setColorScheme(null)],
  ]);

  createEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      const cmdKey = isMac() ? event.metaKey : event.ctrlKey;
      const { shiftKey, altKey } = event;
      const key = event.code.replace(/^Key|^Digit/, "").toLowerCase();

      console.log("key: ", key);

      const found = keybindings.get(
        [cmdKey && "cmd", shiftKey && "shift", altKey && "alt", key]
          .filter(Boolean)
          .join("+")
      );

      if (found) {
        if (cmdKey || altKey) event.preventDefault();
        found();
      }
    };

    window.addEventListener("keydown", onKeydown);

    onCleanup(() => window.removeEventListener("keydown", onKeydown));
  });

  const handleShortcut = (shortcut: string) => keybindings.get(shortcut)?.();

  // Temporary
  onMount(() => {
    document.querySelector("dialog")!.showModal();
  });

  return (
    <CommandCenter>
      <CommandCenterTrigger class="zaduma-hover-before w-12 h-12 -mx-2 rounded-sm dark:text-gray-400 dark:hover:text-gray-300" />
      <CommandCenterDialog
        onClose={() => setPage(undefined)}
        ref={(ref) => (dialog = ref)}
        class={
          "backdrop:bg-white backdrop:bg-opacity-25" +
          " dark:backdrop:bg-black dark:backdrop:bg-opacity-25" +
          " mx-auto transform rounded-xl bg-white" +
          " overflow-hidden shadow-2xl ring-1 ring-black ring-opacity-5" +
          " backdrop-blur backdrop-filter transition-all" +
          " relative p-0 bg-white dark:bg-gray-900 w-96 max-w-full"
        }
      >
        <div class="flex justify-end">
          <DialogCloseButton class="p-2 cursor-pointer group focus:outline-none">
            <Kbd
              aria-hidden
              class="group-hover:border-b group-hover:shadow-[inset_0_1px_1px_0_rgba(0,0,0,0.025)] group-focus:outline"
            >
              esc
            </Kbd>
            <span class="sr-only">Close</span>
          </DialogCloseButton>
        </div>
        <div class="px-2">
          <CommandInput
            aria-label="Commands"
            class={
              "py-2 indent-2 w-full focus:outline-none border-b" +
              " dark:border-gray-700 bg-transparent" +
              " my-1"
            }
            placeholder="What do you need?"
            autofocus
          />
          <Switch
            fallback={
              <>
                <CommandItem shortcut="alt+t" onClick={handleShortcut}>
                  Set Theme
                </CommandItem>
                <CommandGroup heading={<GroupHeading>Posts</GroupHeading>}>
                  <CommandItem shortcut="/" onClick={handleShortcut}>
                    Search Posts
                  </CommandItem>
                </CommandGroup>
                <CommandGroup heading={<GroupHeading>Links</GroupHeading>}>
                  <CommandItem href="">Twitter</CommandItem>
                  <CommandItem href="">GitHub</CommandItem>
                  <CommandItem href="">Contact</CommandItem>
                  <CommandItem href="">RSS</CommandItem>
                </CommandGroup>
              </>
            }
          >
            <Match when={page() === "theme"}>
              <CommandItem shortcut="1" onClick={handleShortcut}>
                Set Theme to Light
              </CommandItem>
              <CommandItem shortcut="2" onClick={handleShortcut}>
                Set Theme to Dark
              </CommandItem>
              <CommandItem shortcut="3" onClick={handleShortcut}>
                Set Theme to System
              </CommandItem>
            </Match>
          </Switch>
        </div>
        <footer class="pb-2" />
      </CommandCenterDialog>
    </CommandCenter>
  );
}

interface CommonCommandItemProps
  extends Omit<CommandCenterItemProps, "onClick"> {}
export type CommandItemProps = CommonCommandItemProps &
  (
    | {
        href?: never;
        shortcut: string;
        onClick: (shortcut: string) => void;
      }
    | { href: string; shortcut?: never; onClick?: never }
  );

function CommandItem(props: CommandItemProps) {
  const [own, rest] = splitProps(props, [
    "shortcut",
    "children",
    "onClick",
    "href",
  ]);

  return (
    <CommandCenterItem
      class={
        "p-2 cursor-pointer zaduma-hover-before focus-visible:outline-black flex justify-between" +
        " text-gray-700 dark:text-gray-300"
      }
      tabIndex={-1}
      onClick={(event) => {
        event.preventDefault();
        if (own.shortcut) own.onClick!(own.shortcut);
      }}
      {...rest}
    >
      {own.children}
      {own.shortcut && <Shortcut class="ml-1" shortcut={own.shortcut} />}
    </CommandCenterItem>
  );
}

function GroupHeading(props: { children: JSX.Element }) {
  return (
    <span class="text-xs p-2 font-semibold text-gray-400 dark:text-gray-500 uppercase leading-none tracking-wider">
      {props.children}
    </span>
  );
}
