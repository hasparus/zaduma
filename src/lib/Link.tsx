import { JSX, splitProps } from "solid-js";

export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  noUnderline?: boolean;
}

export function Link(props: LinkProps) {
  const [own, rest] = splitProps(props, ["classList", "noUnderline"]);

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      classList={{
        ...own.classList,
        [" underline underline-offset-4 decoration-gray-200 dark:decoration-gray-700" +
        " hover:decoration-transparent dark:hover:decoration-transparent" +
        " focus:decoration-transparent dark:focus:decoration-transparent"]:
          !own.noUnderline,
        ["p-2 -mx-2 whitespace-nowrap" +
        " rounded-sm before:rounded-sm" +
        " transition-colors relative before:transition-colors before:bg-transparent" +
        " before:content-[''] before:absolute before:inset-0 before:-z-10 before:pointer-events-none" +
        " hover:before:bg-gray-100 dark:hover:before:bg-gray-800/60 focus:before:bg-gray-100 dark:focus:before:bg-gray-800/60 before:transition-colors"]:
          true,
      }}
      {...rest}
    />
  );
}
