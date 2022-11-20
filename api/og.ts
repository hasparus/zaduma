import { ImageResponse } from "@vercel/og";
import type * as React from "react";

export const config = {
  runtime: "experimental-edge",
};

// Note: `vercel dev` doesn't run `.tsx` endpoints
//        and it can't run @vercel/og because of
//        > Invalid URL: ../vendor/noto-sans-v27-latin-regular.ttf

export default function og() {
  return new ImageResponse(
    h(
      "div",
      {
        tw: `
          bg-gray-500 text-xxl flex items-center content-center
        `,
        children: "WTF",
      },
      "Hello World"
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
