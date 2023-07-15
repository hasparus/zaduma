import { JSX, splitProps } from "solid-js";

export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  noUnderline?: boolean;
}

export function Link(props: LinkProps) {
  const [own, rest] = splitProps(props, ["classList", "noUnderline"]);

  const childIsImg = isChildType(rest.children, "img");

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      classList={{
        ...own.classList,
        [" underline underline-offset-4 decoration-colordecoration" +
        " hover:decoration-transparent" +
        " focus:decoration-transparent"]:
          !own.noUnderline,
        "p-2 -mx-2 rounded-sm before:rounded-sm transition-colors relative ": true,
        "zaduma-hover-before hover:bg-colorhover focus:bg-colorhover selected-bg-colorhover ": true,
        "zaduma-image-box": childIsImg,
      }}
      {...rest}
    />
  );
}

function isChildType(children: JSX.Element, type: string) {
  if (!children || typeof children !== "object") return false;

  // A child can be a JSX element or an stringified Astro slot.
  if ("type" in children) return children.type === type;
  if ("t" in children) {
    return (
      (children.t as string).startsWith(`<astro-slot><${type} `) ||
      (children.t as string).startsWith(`<astro-slot><span zaduma-image`)
    );
  }

  return false;
}
