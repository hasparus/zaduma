import {
  createEffect,
  createSignal,
  type JSX,
  Match,
  onCleanup,
  onMount,
  Show,
  splitProps,
  Switch,
} from "solid-js";

import { type ColorScheme, setScheme } from "./color-scheme";
import {
  CommandCenter,
  CommandCenterDialog,
  CommandCenterTrigger,
  CommandGroup,
  CommandInput,
  CommandItem as CommandCenterItem,
  type CommandItemProps as CommandCenterItemProps,
  CommandList,
  useCommandCenterCtx,
} from "./CommandCenter";
import { DialogCloseButton } from "./Dialog";
import { isMac } from "./isMac";
import { Kbd } from "./Kbd";
import { parseKeys } from "./parseKeys";
import { Shortcut } from "./Shortcut";

const INPUT_ID = "command-input";

export function Commands({
  posts,
}: {
  posts: { title: string; href: string }[];
}) {
  const [clientside, setClientside] = createSignal(false);
  onMount(() => setClientside(true)); // workaround for Astro + Solid Hydration issue

  return (
    <CommandCenter inputId={INPUT_ID}>
      <CommandCenterTrigger class="zaduma-hover-before -mx-4 h-12 w-12 rounded-sm dark:text-gray-400 dark:hover:text-gray-300" />
      <Show when={clientside()} keyed>
        <CommandsPalette posts={posts} />
      </Show>
    </CommandCenter>
  );
}

export function CommandsPalette({
  posts,
}: {
  posts: { title: string; href: string }[];
}) {
  type CommandsPage = "posts" | "theme" | undefined;
  const { getInputValue } = useCommandCenterCtx();

  const [page, setPage] = createSignal<CommandsPage>();
  let dialog: HTMLDialogElement | undefined;

  const setColorScheme = (scheme: ColorScheme) => {
    if (page() !== "theme") return;
    setScheme(scheme);
    dialog?.close();
  };

  const getSelected = () =>
    dialog?.querySelector('[aria-selected="true"]') as HTMLElement | null;

  const keybindings = new Map<string, () => void>([
    [
      "backspace",
      () => {
        setPage(undefined);
      },
    ],
    [
      "escape",
      () => {
        setPage(undefined);
      },
    ],
    [
      "backspace",
      () => {
        if (!getInputValue()) setPage(undefined);
      },
    ],
    [
      "enter",
      () => {
        if (document.activeElement?.id === INPUT_ID) {
          getSelected()?.click();
        }
      },
    ],
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
    [
      "alt+slash",
      () => {
        if (dialog && !dialog.open) dialog.showModal();
        document.getElementById(INPUT_ID)?.focus();
        setPage("posts");
      },
    ],
  ]);

  createEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      const cmdKey = isMac() ? event.metaKey : event.ctrlKey;
      const { shiftKey, altKey } = event;

      const modifiers = [cmdKey && "cmd", shiftKey && "shift", altKey && "alt"];

      const { code, key } = parseKeys(event);

      const found =
        keybindings.get(plus(...modifiers, code)) ||
        keybindings.get(plus(...modifiers, key));

      if (found) {
        if (cmdKey || altKey) event.preventDefault();
        found();
      }
    };

    window.addEventListener("keydown", onKeydown);

    onCleanup(() => window.removeEventListener("keydown", onKeydown));
  });

  const handleShortcut = (shortcut: string) => keybindings.get(shortcut)?.();

  return (
    <CommandCenterDialog
      onClose={() => setPage(undefined)}
      ref={(ref) => (dialog = ref)}
      class={
        "relative mx-auto w-96 max-w-full transform flex-col overflow-hidden rounded-xl bg-white p-0 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all backdrop:bg-white backdrop:bg-opacity-30 dark:bg-gray-900 dark:backdrop:bg-black dark:backdrop:bg-opacity-30 [&[open]]:flex"
      }
    >
      <div class="flex justify-end">
        <DialogCloseButton class="group cursor-pointer p-2 focus:outline-none">
          <Kbd aria-hidden>esc</Kbd>
          <span class="sr-only">Close</span>
        </DialogCloseButton>
      </div>
      <CommandInput
        aria-label="Commands"
        class="relative w-full bg-transparent p-2 indent-2 focus:outline-none"
        placeholder="What do you need?"
        autofocus
      />
      <div class="mx-2 border-b border-gray-200 dark:border-gray-800" />
      <CommandList class="overflow-scroll p-2">
        <Switch
          fallback={
            <>
              <CommandItem shortcut="alt+t" onClick={handleShortcut}>
                Set Theme
              </CommandItem>
              <CommandGroup heading={<GroupHeading>Posts</GroupHeading>}>
                <CommandItem shortcut="alt+slash" onClick={handleShortcut}>
                  Search Posts
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading={<GroupHeading>Links</GroupHeading>}>
                <CommandItem href="https://twitter.com/hasparus">
                  Twitter
                </CommandItem>
                <CommandItem href="https://github.com/hasparus/zaduma">
                  GitHub
                </CommandItem>
                <CommandItem href="https://github.com/hasparus/zaduma/issues">
                  Contact
                </CommandItem>
                <CommandItem href="/rss.xml">RSS</CommandItem>
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
          <Match when={page() === "posts"}>
            <CommandGroup heading={<GroupHeading>Posts</GroupHeading>}>
              {posts.map((p) => (
                <CommandItem href={p.href}>{p.title}</CommandItem>
              ))}
            </CommandGroup>
          </Match>
        </Switch>
      </CommandList>
    </CommandCenterDialog>
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
  const [own, rest] = splitProps(props, ["shortcut", "children", "onClick"]);

  const content = (
    <>
      {own.children}
      <Show when={own.shortcut} keyed>
        {(shortcut) => <Shortcut class="ml-1" shortcut={shortcut} />}
      </Show>
    </>
  );

  return (
    <CommandCenterItem
      class={
        "zaduma-hover-before relative flex w-full cursor-pointer justify-between p-2 text-gray-700 focus-visible:outline-black dark:text-gray-300"
      }
      tabIndex={-1}
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        if (own.shortcut) own.onClick!(own.shortcut);
      }}
      {...rest}
    >
      {content}
    </CommandCenterItem>
  );
}

function GroupHeading(props: { children: JSX.Element }) {
  return (
    <span class="p-2 text-xs font-semibold uppercase leading-none tracking-wider text-gray-400 dark:text-gray-500">
      {props.children}
    </span>
  );
}

function plus(...xs: (string | boolean | undefined | null)[]) {
  return xs.filter(Boolean).join("+");
}
