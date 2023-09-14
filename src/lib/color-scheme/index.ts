const STORAGE_KEY = "ⲍ 🎨";

export type ColorScheme = "light" | "dark" | /* system */ null;

const setClass = (isDark: boolean) =>
  document.documentElement.classList.toggle("dark", isDark);

export const setScheme = (scheme: ColorScheme): void => {
  {
    let isDark: boolean;
    if (scheme) {
      if (window.ⲍ_schemeMql) window.ⲍ_schemeMql.onchange = null;

      isDark = scheme === "dark";
    } else {
      // This seems like a bug in TS ESLint.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const mql = (window.ⲍ_schemeMql ||= window.matchMedia(
        "(prefers-color-scheme: dark)",
      ));

      mql.onchange = (e) => setClass(e.matches);
      isDark = mql.matches;
    }

    setClass(isDark);
  }

  if (typeof localStorage !== "undefined") {
    if (scheme) localStorage.setItem(STORAGE_KEY, scheme);
    else localStorage.removeItem(STORAGE_KEY);
  }
};

export const getStoredScheme = (): ColorScheme => {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY) as ColorScheme;
};

// Reading from localStorage and prefers-color-scheme
// and writing to documentElement.classList happens in InitializeColorScheme
export const getEffectiveScheme = (): "dark" | "light" => {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

declare global {
  interface Window {
    ⲍ_schemeMql?: MediaQueryList;
  }
}
