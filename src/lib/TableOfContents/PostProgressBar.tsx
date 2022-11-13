import { createEffect, onCleanup } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

const OFFSET = 50;

/**
 * Renders vertical progress bar and highlights currently visible heading.
 */
export function PostProgressBar(props: { children: JSX.Element }) {
  let progressThumb!: HTMLDivElement;

  createEffect(() => {
    // We assume the eyes look at the middle of the screen.
    const halfHeight = window.innerHeight / 2;

    const onScroll = throttle(() => {
      const trackHeight = document.documentElement.scrollHeight - halfHeight;
      const pos = window.scrollY + halfHeight;

      const progress = Math.min(1, Math.max(0, pos / trackHeight));

      progressThumb.style.setProperty("--y", `${100 - progress * 100}%`);
    }, 200);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    onCleanup(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });
  }, []);

  return (
    <div class="relative">
      <div class="absolute h-full w-[2px] -left-4 rounded-sm bg-gray-100 overflow-hidden">
        <div
          class={
            "bg-gray-300 absolute h-full w-full rounded-sm -translate-y-[var(--y,100%)] " +
            "transition-transform duration-300 ease-linear"
          }
          ref={progressThumb}
        />
      </div>
      {props.children}
    </div>
  );
}

function throttle(fn: () => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return () => {
    if (!timeout) {
      fn();
      timeout = setTimeout(() => {
        timeout = undefined;
        fn();
      }, wait);
    }
  };
}

function createScrollManager() {
  let callbacks: (() => void)[] = [];
  let scrollPosition = -1;
  let animatedKilled = false;
  
  const animate = () => {
    requestAnimationFrame(onScroll);
  }

  function onScroll(){
    if(animatedKilled) return;
 
    if (scrollPosition !== window.scrollY) {
      window.removeEventListener('scroll', animate);
      scrollPosition = window.scrollY;
      callbacks.forEach(cb => cb(scrollPosition));
      animate();
    } else {
      window.addEventListener('scroll', animate);
    }
  }
  
  animate();
  
  return {
    add: function(cb) {
      callbacks = [...callbacks, cb];
    },
    remove: function(cb) {
      callbacks = callbacks.filter(value => value != cb);
    },
    destroy: function() {
      animatedKilled = true;
      window.removeEventListener('scroll', animate);
    }
  }
}
