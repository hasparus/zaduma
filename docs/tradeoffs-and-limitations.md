# Trade-offs & Limitations

Performance has its costs, and building MPAs with [Astro] might be surprisingly
tricky for developers used to work on SPAs and Next.js apps. I've written down
some of the interesting problems I've encountered while building this starter.

[astro]: https://astro.build/

## Rendering UI depending on values from localStorage is non-trivial.

Let's take a **Color Scheme Toggle** as an example.

We have three values `System | Light | Dark`, and we need `localStorage` to
render correctly. `System` corresponds `null` in `localStorage` and leads to a
`prefers-color-scheme` media query check.

**Nonsolutions**

[client-load]:
  https://docs.astro.build/en/reference/directives-reference/#clientload
[client-only]:
  https://docs.astro.build/en/reference/directives-reference/#clientonly

- Using [`client:load`][client-load] directive blinks from a default value (take
  "system") to current value on navigation. \
  You can see this in [Astro docs](https://docs.astro.build/en/install/auto/). Whenever
  a link is clicked, the sun (or moon) icon dims and lights up again. We effectively
  fall back to skeleton state on each navigation, and that's not ideal for persistent
  parts of the UI like the header.

- A component with [`client:only`][client-only] directive also cannot be
  rendered above the fold.
  [It will blink](https://user-images.githubusercontent.com/15332326/230307183-406e80ba-36ac-48d3-944e-170408c759ff.mov)

**Solutions**

1. Stop using client-only data in persistent parts of the websites. \
   I've put the color scheme toggle in a command menu.

2. `client:load` combined with a blocking script imperatively updating it to
   correct state on every page load.
