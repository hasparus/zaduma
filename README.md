# zaduma, a minimal Astro template

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

<pre>
<code>
├── public/
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
