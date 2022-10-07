import { For } from "solid-js";

import { getStoredScheme, setScheme } from "./index";

export function ColorSchemeSelect() {
  const options = [
    { value: "", label: "System", icon: SystemIcon },
    { value: "light", label: "Light", icon: SunIcon },
    { value: "dark", label: "Dark", icon: MoonIcon },
  ];

  const currentScheme = getStoredScheme() || "";
  const currentOption = options.find((o) => o.value === currentScheme);

  return (
    <div class="zaduma-hover-before cursor-pointer rounded-sm">
      <select
        class={
          "bg-transparent cursor-pointer appearance-none rounded-sm p-2 px-8" +
          " outline outline-gray-100 dark:outline-gray-700" +
          " focus-visible:outline-2 focus-visible:outline-black focus-visible:dark:outline-white"
        }
        id="color-scheme"
        aria-label="Change color scheme"
        onChange={(event) => {
          setScheme(
            (event.currentTarget.value as "dark" | "light" | "") || null
          );
        }}
        style={{
          color: "var(--text-color)",
        }}
      >
        <For each={options}>
          {(x) => (
            <option value={x.value} selected={x === currentOption}>
              {x.label}
            </option>
          )}
        </For>
      </select>
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-5 h-5 pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  );
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
      <path d="M14 6H6v8h8V6z" />
      <path
        fill-rule="evenodd"
        d="M9.25 3V1.75a.75.75 0 011.5 0V3h1.5V1.75a.75.75 0 011.5 0V3h.5A2.75 2.75 0 0117 5.75v.5h1.25a.75.75 0 010 1.5H17v1.5h1.25a.75.75 0 010 1.5H17v1.5h1.25a.75.75 0 010 1.5H17v.5A2.75 2.75 0 0114.25 17h-.5v1.25a.75.75 0 01-1.5 0V17h-1.5v1.25a.75.75 0 01-1.5 0V17h-1.5v1.25a.75.75 0 01-1.5 0V17h-.5A2.75 2.75 0 013 14.25v-.5H1.75a.75.75 0 010-1.5H3v-1.5H1.75a.75.75 0 010-1.5H3v-1.5H1.75a.75.75 0 010-1.5H3v-.5A2.75 2.75 0 015.75 3h.5V1.75a.75.75 0 011.5 0V3h1.5zM4.5 5.75c0-.69.56-1.25 1.25-1.25h8.5c.69 0 1.25.56 1.25 1.25v8.5c0 .69-.56 1.25-1.25 1.25h-8.5c-.69 0-1.25-.56-1.25-1.25v-8.5z"
        clip-rule="evenodd"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
      <path
        fill-rule="evenodd"
        d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
        clip-rule="evenodd"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="w-5 h-5"
    >
      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
    </svg>
  );
}
