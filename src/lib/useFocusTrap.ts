import { createEffect, onCleanup } from "solid-js";

const FOCUSABLE_ELEMENTS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(ref: { current: HTMLElement | undefined }) {
  createEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const modal = ref.current;

      if (!modal) return;

      const focusableContent = modal.querySelectorAll(FOCUSABLE_ELEMENTS);
      const firstFocusableElement = focusableContent[0];
      const lastFocusableElement =
        focusableContent[focusableContent.length - 1];

      const isTabPressed = e.key === "Tab" || e.keyCode === 9;

      if (!isTabPressed) return;

      if (e.shiftKey) {
        if (
          document.activeElement === firstFocusableElement &&
          lastFocusableElement
        ) {
          if ("focus" in lastFocusableElement) {
            (lastFocusableElement as HTMLElement).focus();
            e.preventDefault();
          }
        }
      } else {
        if (
          document.activeElement === lastFocusableElement &&
          firstFocusableElement
        ) {
          if ("focus" in firstFocusableElement) {
            (firstFocusableElement as HTMLElement).focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    onCleanup(() => document.removeEventListener("keydown", onKeyDown));
  });
}
