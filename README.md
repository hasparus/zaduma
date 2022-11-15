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
