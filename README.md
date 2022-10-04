# zaduma, a minimal Astro template

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

<pre>
<code>
├── public/
├── posts/
│   └── rebuilding-a-blog.mdx — posts written in <a href="https://mdxjs.com/">MDX</a>
├── src/
│   ├── build-time/* — remark plugins
│   ├── layouts/
│   │   ├── <b>BaseLayout.astro</b> — UI shared between all pages
│   │   └── <b>PostLayout.astro</b> — layout for all posts
│   ├── lib/* — reusable utils and UI components
│   ├── pages/
│   │   ├── <b>[path].astro</b>
│   │   └── <b>index.astro</b>
│   ├── env.d.ts
│   ├── font.css
│   ├── global.css
│   ├── prose.css
│   └── types.ts
└── package.json
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
