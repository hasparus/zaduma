import { ImageResponse } from "@vercel/og";
import type * as React from "react";

const author = {
  name: "Yours Truly",
  avatarSrc: "https://i.pravatar.cc/256?u=30",
};

type Author = typeof author;

export const config = { runtime: "edge" };

// Note: `vercel dev` doesn't run `.tsx` endpoints
//        and it can't run @vercel/og because of
//        > Invalid URL: ../vendor/noto-sans-v27-latin-regular.ttf
//        The only way to work with this file is repeatedly pushing and checking
//        the result on Vercel Preview Deployments.

/**
 * TODO:
 * - [x] Use Inter font
 * - [x] Update all libraries related to Vercel OG
 * - [x] White footer avatar of the author, their handle, date and reading time of the post
 * - [x] Very bold (weight 900) white title on top of the gradient
 * - [x] Secure the endpoint https://vercel.com/docs/concepts/functions/edge-functions/og-image-examples#encrypting-parameters
 * - [ ] Grain Overlay — mix-blend-mode is not supported, so I'll need to combine grain.svg with the image / generated gradient
 *  - [ ] Random Gradient or an illustration in the background
 *  - use Vercel OG playground to build it and manually rewrite JSX
 * - [ ] Text with the color contrasting with gradient
 */

const interRegular = fetchFont(
  new URL("../assets/og/Inter-Regular.ttf", import.meta.url)
);
const interBlack = fetchFont(
  new URL("../assets/og/Inter-Black.ttf", import.meta.url)
);

export default async function og(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = parseSearchParams(url.searchParams);

    await assertTokenIsValid(searchParams);

    const post: Post = {
      date: new Date(searchParams.date),
      title: searchParams.title,
      readingTimeMinutes: Math.round(searchParams.readingTime),
    };

    return new ImageResponse(
      h(
        "div",
        {
          tw: `
            w-full h-full
            font-Inter
            flex flex-col
          `,
        },
        h(Illustration, {}, h(Title, { title: post.title })),
        h(Footer, { author, post })
      ),
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: "Inter",
            data: await interRegular,
            weight: 400,
            style: "normal",
          },
          {
            name: "Inter",
            data: await interBlack,
            weight: 900,
            style: "normal",
          },
        ],
      }
    );
  } catch (err: unknown) {
    console.error(err);

    const error = err instanceof Error ? err : new Error(String(err));

    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

function Illustration({ children }: { children?: React.ReactNode[] }) {
  return h(
    "div",
    {
      tw: `
        flex flex-1 justify-start items-end w-full p-4
        bg-black
      `,
    },
    ...children
  );
}

function Title({ title }: { title: string }) {
  return h(
    "h1",
    {
      tw: `
        text-9xl font-black
        text-white
        leading-none
      `,
    },
    title
  );
}

function Footer({ author, post }: { author: Author; post: Post }) {
  return h(
    "footer",
    {
      tw: `
      h-28 w-full px-4 py-2.5
      bg-white
      text-4xl
      flex flex-row justify-center items-center
    `,
    },
    h("img", {
      width: 92,
      height: 92,
      src: author.avatarSrc,
      tw: `rounded-full`,
    }),
    h("span", { tw: `ml-4` }, author.name),
    h("div", { tw: `flex-1` }),
    h(
      "span",
      {},
      [
        post.date.toLocaleDateString("sv-SE"),
        post.readingTimeMinutes > 1 && `${post.readingTimeMinutes} min`,
      ]
        .filter(Boolean)
        .join(" · ")
    )
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

function fetchFont(url: URL) {
  return fetch(url).then((res) => res.arrayBuffer());
}

type Post = {
  date: Date;
  title: string;
  readingTimeMinutes: number;
};

export type OgFunctionSearchParams = {
  title: string;
  date: number; // timestamp
  readingTime: number; // minutes
  token?: string;
};

function parseSearchParams(
  searchParams: URLSearchParams
): OgFunctionSearchParams {
  const date = Number(searchParams.get("date"));
  const readingTime = Number(searchParams.get("readingTime"));
  const title = searchParams.get("title");

  if (!date || !readingTime || !title) {
    throw new HttpError("Missing required search params.", 400);
  }

  return {
    title,
    date,
    readingTime,
    token: searchParams.get("token"),
  };
}

class HttpError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

/**
 * @see https://vercel.com/docs/concepts/functions/edge-functions/og-image-examples#encrypting-parameters
 */
async function assertTokenIsValid({
  token: receivedToken,
  ...data
}: OgFunctionSearchParams): Promise<void> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(process.env.OG_IMAGE_SECRET),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );

  const arrayBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(JSON.stringify(data))
  );

  const token = Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (n: number) =>
      n.toString(16).padStart(2, "0")
    )
    .join("");

  if (receivedToken !== token) {
    throw new HttpError("Invalid token.", 401);
  }
}
