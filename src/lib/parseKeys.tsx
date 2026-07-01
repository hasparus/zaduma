/**
 * Reads keys from KeyboardEvent in normalized form.
 *
 * e.g. pressing alt+t results in event.key `†` on my keyboard,
 * but `event.code` is `KeyT`, so we extract the `t` out of it.
 */
export function parseKeys(event: KeyboardEvent) {
  const code = event.code.replace(/^Key|^Digit/, "").toLowerCase();
  const key = event.key.toLowerCase();
  return { code, key };
}
