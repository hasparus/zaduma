# zaduma

_an [Astro] starter template for understated personal websites_

**Built with:**

- [SolidJS]
- [MDX], [Remark] and [Unified]
- [Shiki Twoslash][shiki-twoslash]
- [Tailwind CSS][tailwind-css]

[astro]: https://astro.build/
[solidjs]: https://www.solidjs.com/
[mdx]: https://mdxjs.com/
[remark]: https://github.com/remarkjs/remark
[unified]: https://unifiedjs.com/
[shiki-twoslash]: https://github.com/shikijs/twoslash
[tailwind-css]: https://tailwindcss.com/

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/hasparus/zaduma/tree/main)

## 🏛 Project Structure

Inside of your Astro project, you'll see the following folders and files:

<pre>
<code>
├── public/ — <i>static assets</i>
├── posts/
│   └── rebuilding-a-blog.mdx — <i>posts written in <a href="https://mdxjs.com/">MDX</a></i>
├── src/
│   ├── build-time/* — <i>remark plugins</i>
│   ├── global-styles/* — <i>fonts, body and prose styles</i>
│   ├── layouts/
│   │   ├── BaseLayout.astro — <i>UI shared between all pages</i>
│   │   └── PostLayout.astro — <i>layout for all posts</i>
│   ├── lib/* — <i>reusable utils and UI components</i>
│   ├── pages/
│   │   ├── [path].astro — <i>Astro dynamic route for posts, supplies MDX components</i>
│   │   └── index.astro — <i>index page, lists all posts</i>
│   ├── env.d.ts
│   └── types.ts
├── astro.config.ts
├── package.json
├── postcss.config.cjs
├── tailwind.config.cjs — <i>Tailwind config, colors, fonts</i>
└── tsconfig.json
</code>
</pre>

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                 | Action                                           |
| :---------------------- | :----------------------------------------------- |
| `pnpm install`          | Installs dependencies                            |
| `pnpm run dev`          | Starts local dev server at `localhost:3000`      |
| `pnpm run build`        | Build your production site to `./dist/`          |
| `pnpm run preview`      | Preview your build locally, before deploying     |
| `pnpm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro --help` | Get help using the Astro CLI                     |

---

## Trade-offs & Limitations

Performance has its costs, and building MPAs with [Astro] might be surprisingly
tricky for developers used to work on SPAs and Next.js apps. I've written down
some of the interesting problems I've encountered while building this starter.

[astro]: https://astro.build/

### Rendering UI depending on values from localStorage is non-trivial.

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
  [It will blink](<./docs/client:only blinks on navigation.mov>).

**Solution**

- Stop using client-only data in persistent parts of the websites. \
  I've put the color scheme toggle in a command menu.
