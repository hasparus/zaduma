import { createEffect, onCleanup } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

/**
 * Renders vertical progress bar and highlights currently visible heading.
 */
export function PostProgressBar(props: { children: JSX.Element }) {
  let progressThumb!: HTMLDivElement;

  createEffect(() => {
    // We assume the eyes look at the middle of the screen.
    const onScroll = () => {
      const trackHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pos = window.scrollY;

      const progress = Math.min(1, Math.max(0, pos / trackHeight));

      progressThumb.style.setProperty("--y", `${100 - progress * 100}%`);
    };

    const disposeScrollListener = createScrollListener(onScroll);
    window.addEventListener("resize", onScroll, { passive: true });

    onCleanup(() => {
      disposeScrollListener();
      window.removeEventListener("resize", onScroll);
    });
  }, []);

  return (
    <div class="relative">
      <div class="absolute h-full w-[2px] -left-4 rounded-sm bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          class={
            "bg-gray-300 dark:bg-gray-700 absolute h-full w-full rounded-sm " +
            "-translate-y-[var(--y,100%)] transition-transform duration-300 ease-linear"
          }
          ref={progressThumb}
        />
      </div>
      {props.children}
    </div>
  );
}

function createScrollListener(callback: (scrollY: number) => void) {
  let scrollY = -1;
  let animatedKilled = false;

  const animate = () => {
    requestAnimationFrame(onScroll);
  };

  function onScroll() {
    if (animatedKilled) return;

    const newPos = window.scrollY;
    if (scrollY !== newPos) {
      window.removeEventListener("scroll", animate);
      scrollY = window.scrollY;
      callback(scrollY);
      animate();
    } else {
      window.addEventListener("scroll", animate);
    }
  }

  animate();

  return () => {
    animatedKilled = true;
    window.removeEventListener("scroll", animate);
  };
}
