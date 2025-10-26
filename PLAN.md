# To-do

1. Port Pre & Code changes from my homepage upstream to Zaduma
2. Look for more changes to port from my homepage upstream to Zaduma
3. Get Codex and Claude to write tests for these features
4. Update Astro, one major at a time

---

# Next steps

Okay, I feel like I don't really want Expressive Code now, and I'm considering
once again configuring @shikijs/rehype with twoslash like in fumadocs.

As this Fumadocs exposes Shiki transformer I can just try to import its packages
despite of the fact we're not using Fumadocs.

## Migrating Shiki

If Astro's internal Shiki won't be enough

1. Migrate Shiki one major at a time (to v2, then to v3).
2. Ensure we use CSS vars instead of displaying two code blocks (Shiki Dual
   Themes)

## Maybe:

1. Install Astro Expressive Code:
   https://docs.astro.build/en/guides/syntax-highlighting/
2. Install Expessive Code Twoslash: https://twoslash.matthiesen.dev/
3. Run visual regression tests against my homepage
