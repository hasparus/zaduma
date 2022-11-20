import { ImageResponse } from "@vercel/og";
import type * as React from "react";

export const config = {
  runtime: "experimental-edge",
};

// Note: `vercel dev` doesn't run `.tsx` endpoints
//        and it can't run @vercel/og because of
//        > Invalid URL: ../vendor/noto-sans-v27-latin-regular.ttf

/**
 * TODO:
 * - [ ] Use Inter font
 * - [ ] Grain Overlay
 * - [ ] Random Gradient or an illustration in the background
 * - [ ] Text with the color contrasting with gradient
 * - [ ] Very bold (weight 900) white title on top of the gradient
 * - [ ] White footer avatar of the author, their handle, date and reading time of the post
 */

export default function og(req: Request) {
  const url = new URL(req.url);

  return new ImageResponse(
    h(
      "div",
      {
        tw: `
          bg-neutral-100 flex items-center content-center
        `,
      },
      req.url
    ),
    {
      width: 1200,
      height: 600,
    }
  );
}

function h<T extends React.ElementType<any>>(
  type: T,
  props: React.ComponentPropsWithRef<T>,
  ...children: React.ReactNode[]
) {
  return {
    type,
    key: "key" in props ? props.key : null,
    props: {
      ...props,
      children: children && children.length ? children : props.children,
    },
  };
}
