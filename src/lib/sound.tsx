import { setEnabled, setTheme } from "cuelume";

const STORAGE_KEY = "sound";

export function isSoundOn() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSound(on: boolean) {
  setEnabled(on);
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Sound still follows `on` until the page reloads.
  }
}

if (typeof window !== "undefined") {
  setTheme("press");
  setEnabled(isSoundOn());
}
