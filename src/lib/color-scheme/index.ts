const STORAGE_KEY = "ⲍ 🎨";

export type ColorScheme = "light" | "dark" | /* system */ null;

export const setScheme = (scheme: ColorScheme): void => {
  const isDark =
    scheme === "dark" ||
    (!scheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);

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
