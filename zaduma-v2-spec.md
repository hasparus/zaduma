# Zaduma v2 — Spec

## What
Astro 5 blog/notes template with inline editing. Reusable, deploy-agnostic.

## URLs
- `/:slug` — public SSG article
- `/:slug/edit` — authenticated inline editor (SSR)
- `/` — minimal index (title + date list)

## Editing
- **Lexical** (facebook/lexical) editor, styled identically to the public article CSS
- Same layout, same typography — the edit view IS the article, just editable
- Floating toolbar on selection (bold, italic, heading, link, code)
- Custom Lexical nodes for MDX components (callouts, embeds) — rendered as opaque editable blocks
- Save serializes Lexical state → MDX → commits to content source

## Media (drag & drop)
- Drop images/PDFs onto editor → upload to storage → insert at cursor
- Images render inline, PDFs as download cards
- **Storage adapter interface** — default implementation for Cloudflare R2
  - Presigned URL upload flow (no server proxy needed for large files)
  - Config via env vars: `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY`, `STORAGE_ENDPOINT`
  - Swappable for S3, local fs, etc.

## Auth
- Abstract auth interface — `getUser()`, `requireAuth()` middleware
- Default: GitHub OAuth (good for solo devs)
- Protected routes: `/:slug/edit`, `/api/*`
- No auth on public routes

## Content source
- MDX files in `src/content/` (Astro content collections)
- Save flow: tiptap → MDX → write to fs (dev) or GitHub API (prod)
- Git-backed — every save is a commit

## Astro setup
- **Astro 5** with hybrid rendering (SSG default, SSR for `/edit` and `/api`)
- Content collections for articles
- MDX integration

## API routes
- `POST /api/articles/:slug` — save article (MDX body)
- `POST /api/upload` — get presigned upload URL
- `GET /api/auth/login` — OAuth redirect
- `GET /api/auth/callback` — OAuth callback

## Deploy-agnostic
- No Cloudflare/Vercel-specific code in core
- Adapter pattern for: storage, auth, git writes
- Works with any Astro-compatible host

## Workstreams
1. **Astro 5 upgrade** — update Zaduma + homepage from 4.9 → 5.x
2. **Edit routes + auth** — hybrid SSR, GitHub OAuth, protected middleware
3. **Lexical editor** — editor setup, MDX serialization, matching styles
4. **Media upload** — R2 adapter, drag-and-drop, presigned URLs
5. **New RPG site** — fresh Zaduma instance for RPG notes

## Open decisions
- [ ] MDX component editing — start with opaque blocks, iterate?
- [ ] Real-time collab (future)? Probably not needed for solo use
- [ ] Image optimization pipeline (sharp/cloudflare images)?
