# zaduma

_an [Astro] starter template for understated personal websites_

**Built with:**

- [SolidJS]
- [MDX], [Remark] and [Unified]
- [Shiki Twoslash][shiki-twoslash]
- [Tailwind CSS][tailwind-css]
- Vercel and [Vercel OG][vercel-og]
- [GitHub Actions][github-actions]

[astro]: https://astro.build/
[solidjs]: https://www.solidjs.com/
[mdx]: https://mdxjs.com/
[remark]: https://github.com/remarkjs/remark
[unified]: https://unifiedjs.com/
[shiki-twoslash]: https://github.com/shikijs/twoslash
[tailwind-css]: https://tailwindcss.com/
[vercel-og]:
  https://vercel.com/blog/introducing-vercel-og-image-generation-fast-dynamic-social-card-images
[github-actions]: https://github.com/features/actions

## 🏎️ Usage TLDR

1. Click <kbd>Use this template</kbd> to create a new repo.
2. Set [`VERCEL_TOKEN`], `VERCEL_PROJECT_ID`, and [`VERCEL_ORG_ID`] secrets to
   deploy to Vercel from GHA (enables access to git history).
3. Add `OG_IMAGE_SECRET` to secure your OG image endpoint.

_[See full usage instructions.](#-usage)_

## 🏛 Project Structure

Inside of your Astro project, you'll see the following folders and files:

<pre>
<code>
├── posts/
│   └── rebuilding-a-blog.mdx — <i>posts written in <a href="https://mdxjs.com/">MDX</a></i>
├── public/ — <i>static assets apart from images</i>
├── src/
│   ├── build-time/* — <i>remark plugins</i>
│   ├── global-styles/* — <i>fonts, body and prose styles</i>
│   ├── layouts/
│   │   ├── BaseLayout.astro — <i>UI shared between all pages</i>
│   │   └── PostLayout.astro — <i>layout for all posts</i>
│   ├── lib/* — <i>reusable utils and UI components</i>
│   ├── images/* — <i>pictures (need to be here to be optimized by Astro Image)</i>
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

## 👌 Usage

1. Click <kbd>Use this template</kbd> to create a new repo.
2. Clone the repository, install with `pnpm install` and run with `pnpm dev`.
3. Style it and personalize however you like 💅
4. Set [`VERCEL_TOKEN`], `VERCEL_PROJECT_ID`, and [`VERCEL_ORG_ID`] secrets to
   deploy to Vercel from GHA (what enables access to git history).
   ([_Settings→Secrets_](https://github.com/hasparus/zaduma/settings/secrets/actions))

   - Alternatively — if all your blog posts have a `date` in frontmatter, you
     don't need to deploy through _workflows/ci.yml_. Feel free to remove the
     deploy steps from the YML file and connect Vercel/Netlify integration. Go
     to `derivedTitleAndDatePlugin` function and remove `execSync("git log")`
     from it. (TODO: Can we make it more convenient?)

5. Generate a passphrase for `OG_IMAGE_SECRET` to secure your OG image endpoint,
   and add it to
   [Actions Secrets](<(https://github.com/hasparus/zaduma/settings/secrets/actions)>).

[`vercel_token`]: https://vercel.com/account/tokens
[`vercel_org_id`]: https://vercel.com/account#your-id
