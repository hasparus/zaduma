import { type JSX, splitProps } from "solid-js";

import { GitHubIcon } from "../icons/GitHubIcon";
import { Link } from "../Link";

import styles from "./code-and-pre.module.css";

export function Code(props: JSX.HTMLAttributes<HTMLElement>) {
  return (
    <code {...props} classList={{ ...props.classList, [styles.Code!]: true }} />
  );
}

interface PreProps extends JSX.HTMLAttributes<HTMLPreElement> {
  github?: string;
  wrap?: boolean;
  "line-numbers"?: number | boolean;
}

export function Pre(props: PreProps) {
  const [local, rest] = splitProps(props, ["github", "wrap", "line-numbers"]);

  const content = (
    <pre
      {...rest}
      data-wrap={local.wrap ? "true" : undefined}
      data-line-numbers={local["line-numbers"] ? "true" : undefined}
      style={{
        ...(rest.style as object),
        "--start": local["line-numbers"]
          ? local["line-numbers"] === true
            ? 0
            : local["line-numbers"].toString()
          : undefined,
      }}
      classList={{
        ...rest.classList,
        [styles.Pre!]: true,
        "py-1": !!local.github,
      }}
    />
  );

  if (local.github) {
    return (
      <figure class="bg-gray-100/50 dark:bg-gray-800/25">
        <GitHubCodeSnippetFigcaption link={local.github} />
        {content}
      </figure>
    );
  }

  return content;
}

function GitHubCodeSnippetFigcaption(props: { link: string }) {
  const urlWithoutDomain = props.link.replace(/^https?:\/\/github\.com\//, "");
  const parts = urlWithoutDomain.split("/");
  const repoName = `${parts[0]}/${parts[1]}`;
  const filepath = `/${parts.slice(4).join("/")}`;

  return (
    <figcaption class="flex items-center justify-between border-b border-gray-300 bg-white !px-0 !font-sans !text-sm !not-italic dark:border-gray-700 dark:bg-gray-900 [&:has(~_.github-dark)]:hidden dark:[&:has(~_.github-dark)]:flex dark:[&:has(~_.github-light)]:hidden">
      <Link
        target="_blank"
        rel="noreferrer"
        noUnderline
        noHoverBackground
        href={`https://github.com/${repoName}`}
        class="flex items-center gap-1 p-0 py-1 decoration-gray-200 underline-offset-4 hover:underline dark:decoration-gray-700"
      >
        <GitHubIcon class="size-3.5" />
        {repoName}
      </Link>

      <Link
        href={props.link}
        target="_blank"
        rel="noreferrer"
        noUnderline
        noHoverBackground
        class="p-0 py-1 decoration-gray-200 underline-offset-4 hover:underline dark:decoration-gray-700"
      >
        {filepath}
      </Link>
    </figcaption>
  );
}
