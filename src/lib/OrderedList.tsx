import type { JSX } from "solid-js/jsx-runtime";

export function OrderedList(props: JSX.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      {...props}
      style={{
        ...(props.style as object),
        "--start": (props as { start?: number | string }).start || 0,
      }}
    />
  );
}
