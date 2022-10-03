import { JSX, splitProps } from "solid-js";

export function Link(props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const [own, rest] = splitProps(props, ["classList"]);

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      classList={{
        ...own.classList,
        ["p-2 -mx-2" +
        " rounded-sm underline underline-offset-4" +
        " decoration-gray-200 dark:decoration-gray-700" +
        " hover:decoration-transparent dark:hover:decoration-transparent" +
        " focus:decoration-transparent dark:focus:decoration-transparent" +
        " transition-colors relative" +
        " before:content-[''] before:absolute before:inset-0 before:-z-10 before:pointer-events-none" +
        " hover:before:bg-gray-100 dark:hover:before:bg-gray-800/60 focus:before:bg-gray-100 dark:focus:bg-gray-800/60 before:transition-colors"]:
          true,
      }}
      {...rest}
    />
  );
}
