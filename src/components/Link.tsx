import { JSX, splitProps } from "solid-js";

export function Link(props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const [own, rest] = splitProps(props, ["classList"]);

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      classList={{
        ...own.classList,
        ["p-2 -mx-2" +
        " rounded-sm underline decoration-gray-200 hover:decoration-transparent focus:decoration-transparent" +
        " transition-colors relative" +
        " before:content-[''] before:absolute before:inset-0 before:-z-10 before:pointer-events-none" +
        " hover:before:bg-gray-100 focus:before:bg-gray-100 before:transition-colors"]:
          true,
      }}
      {...rest}
    />
  );
}
