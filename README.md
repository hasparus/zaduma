# zaduma, a minimal Astro template

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

<pre>
<code>
├── public/
├── posts/
│   └── <i>rebuilding-a-blog.mdx</i> — posts written in <a href="https://mdxjs.com/">MDX</a>
├── src/
│   ├── build-time/* — remark plugins
│   ├── global-styles/* — fonts, body and prose styles
│   ├── layouts/
│   │   ├── <i>BaseLayout.astro</i> — UI shared between all pages
│   │   └── <i>PostLayout.astro</i> — layout for all posts
│   ├── lib/* — reusable utils and UI components
│   ├── pages/
│   │   ├── <i>[path].astro</i>
│   │   └── <i>index.astro</i>
│   ├── <i>env.d.ts</i>
│   └── <i>types.ts</i>
├── <i>astro.config.ts</i>
├── <i>package.json</i>
├── <i>postcss.config.cjs</i>
├── <i>tailwind.config.cjs</i> — Tailwind config and theme — colors, fonts
└── <i>tsconfig.json</i>

</code>
</pre>

Any static assets, like images, can be placed in the `public/` directory.

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
