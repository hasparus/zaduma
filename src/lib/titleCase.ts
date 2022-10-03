const smallWords =
  /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
const alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/;
const wordSeparators = /([ :–—-])/;

/**
 * @author David Gouch
 * @see https://github.com/gouch/to-title-case/blob/master/to-title-case.js
 * @changes
 *   - moved fron string prototype to a function export
 *   - annotated with TypeScript
 *   - returned " " when `current === "-"`, because our pathnames are kebab-cased
 */
export function titleCase(str: string) {
  return str
    .split(wordSeparators)
    .map((current, index, array) => {
      if (current === "-") return " ";

      if (
        /* Check for small words */
        current.search(smallWords) > -1 &&
        /* Skip first and last word */
        index !== 0 &&
        index !== array.length - 1 &&
        /* Ignore title end and subtitle start */
        array[index - 3] !== ":" &&
        array[index + 1] !== ":" &&
        (array[index + 1] !== "-" ||
          (array[index - 1] === "-" && array[index + 1] === "-"))
      ) {
        return current.toLowerCase();
      }

      /* Ignore intentional capitalization */
      if (current.slice(1).search(/[A-Z]|\../) > -1) {
        return current;
      }

      /* Ignore URLs */
      if (array[index + 1] === ":" && array[index + 2] !== "") {
        return current;
      }

      /* Capitalize the first letter */
      return current.replace(alphanumericPattern, (match) =>
        match.toUpperCase()
      );
    })
    .join("");
}
