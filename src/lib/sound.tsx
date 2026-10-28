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
    return true;
  } catch {
    return false;
  }
}

if (typeof window !== "undefined") {
  setTheme("press");
  setEnabled(isSoundOn());
}
