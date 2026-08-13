---
version: alpha
name: Ygrowly Personal Site
description: A solo engineer's personal site (Astro) for job hunting, blogging, and notes. Design direction is a "mission console": modern business as the base (white/charcoal/navy, structured, trustworthy) with future-tech instrumentation as the garnish (cyan HUD lines, glow, glass, micro-motion). Two accent colors with distinct roles — navy is the business interactive color, cyan is the tech instrument color (HUD labels, focus rings, status, glow). A separate, deliberately playful terminal/dev-mode/mascot layer exists as an easter egg and does not follow these tokens (see Sub-themes).
colors:
  background: '0 0% 100%'
  foreground: '240 6% 10%'
  card: '210 40% 98%'
  card-foreground: '240 6% 10%'
  popover: '0 0% 100%'
  popover-foreground: '240 6% 10%'
  primary: '224 76% 48%'
  primary-foreground: '0 0% 100%'
  secondary: '210 40% 96.1%'
  secondary-foreground: '240 6% 10%'
  muted: '240 5% 96%'
  muted-foreground: '240 5% 34%'
  accent: '210 40% 96.1%'
  accent-foreground: '240 6% 10%'
  destructive: '0 72.22% 50.59%'
  destructive-foreground: '0 0% 98%'
  border: '240 6% 90%'
  input: '240 6% 90%'
  ring: '192 91% 36%'
  term-surface: '210 20% 97%'
  term-chrome: '210 20% 95%'
  term-ok: '142 50% 40%'
  code-bg: '220 14% 93%'
  code-fg: '220 13% 18%'
# colorsDark is a non-normative extension (not part of the base design.md
# spec): the site is dual-theme, and we keep both themes in one file rather
# than splitting into a second design.dark.md. Same keys as `colors` above,
# values applied when `.dark` is set on <html>.
colorsDark:
  background: '225 50% 8%'
  foreground: '220 3% 93%'
  card: '224 43% 10%'
  card-foreground: '220 3% 93%'
  popover: '224 39% 13%'
  popover-foreground: '220 3% 93%'
  primary: '187 86% 53%'
  primary-foreground: '222 47% 11%'
  secondary: '224 40% 14%'
  secondary-foreground: '220 3% 93%'
  muted: '223 40% 12%'
  muted-foreground: '219 8% 69%'
  accent: '224 40% 14%'
  accent-foreground: '220 3% 93%'
  destructive: '0 62.8% 30.6%'
  destructive-foreground: '0 0% 98%'
  border: '214 32% 17%'
  input: '214 32% 17%'
  ring: '187 86% 53%'
  term-surface: '240 18% 7%'
  term-chrome: '240 18% 4%'
  term-ok: '142 60% 65%'
  code-bg: '223 40% 13%'
  code-fg: '0 0% 92%'
typography:
  body:
    fontFamily: 'Instrument Sans / Geist Variable'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  brand:
    fontFamily: 'Instrument Sans / Geist Variable'
    fontSize: 20px
    fontWeight: 700
  prose-heading:
    fontFamily: 'Instrument Sans / Geist Variable'
    fontWeight: 500
  ui-label:
    fontFamily: 'JetBrains Mono'
    fontSize: 12px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0.12em
rounded:
  md: 6px
  lg: 8px
  xl: 12px
  2xl: 16px
  full: 9999px
spacing:
  icon-button: 6px
  nav-gap: 16px
  card-sm: 16px
  card-md: 20px
  card-lg: 24px
---

# Design Conventions

This documents what the codebase actually does, not an aspirational spec.

## Overview

A solo engineer's personal site: job hunting (resume, projects), blogging,
and notes. The design direction is a **mission console** — modern business
as the base (white surfaces, charcoal text, navy interactive color,
structured grids, restrained shadows: trustworthy, recruiter-friendly) with
future-tech instrumentation as the garnish (cyan HUD lines, corner brackets,
glow rings, glass header, scan-line animation, 3D tilt — kept quiet so the
base stays professional). The terminal / dev-mode / mascot layer remains a
deliberately playful exception (macOS window chrome, a mascot speech
bubble), clearly a different "device" from the rest of the site. See
[Sub-themes](#sub-themes).

## Colors

All color is driven by CSS variables in
[`app.css`](src/assets/styles/app.css:17-131), set in `:root` and
overridden in `.dark` (toggled as a class on `<html>`, see
[`ThemeProvider.astro`](src/components/ThemeProvider.astro:24)).

Two token layers coexist:

**Homepage design tokens** (`--bg-*`, `--text-*`, `--signal-*`, `--tech-*`,
etc., hex values) — consumed by the homepage and header components.

**Legacy HSL-triplet aliases** (`--background`, `--primary`, etc., raw
`H S% L%` with no `hsl()` wrapper) — consumed by astro-pure and UnoCSS with
an alpha channel: `hsl(var(--primary) / 0.25)`. Keep both layers in sync
when adding a color.

### The two-accent rule

The design has two accent colors with distinct jobs. Don't collapse them:

- **`--signal-accent` (navy `#1d4ed8` light / cyan `#22d3ee` dark)** — the
  *business interactive color*: buttons, links, hover border highlights. It
  flips between navy (light) and cyan (dark), matching how an accent must
  still read as one on each theme.
- **`--tech-accent` / `--tech-glow` (cyan family in both themes)** — the
  *tech instrument color*: mono HUD labels, section eyebrows, status dots,
  focus rings, corner brackets, glow shadows. Cyan on white is dimmed to
  `#0e7490` for text (`--tech-accent`) while decorative glows use
  `#06b6d4` (`--tech-glow`); both are `#22d3ee` in dark.

Rule of thumb: mono labels/status → `--tech-accent`; interactive
elements → `--signal-accent`; text on top of `--signal-accent` →
`--accent-contrast` (white on navy / near-black on cyan — never hardcode
`#fff` on an accent background).

| Token                    | Light                  | Dark                    | Used for                     |
| ------------------------ | ---------------------- | ----------------------- | ---------------------------- |
| `--bg-page`              | `#ffffff`              | `#0a0f1e`               | Page base                    |
| `--bg-surface`/`-elevated` | `#f8fafc` / `#ffffff` | `#0f1526` / `#141b2e` | Section fills, cards         |
| `--text-primary`         | `#18181b`              | `#e6eaf2`               | Body text                    |
| `--text-secondary`/`-tertiary` | `#52525b` / `#71717a` | `#a3adbf` / `#748098` | Muted text, mono data labels |
| `--signal-accent`/`-hover` | `#1d4ed8` / `#1e40af` | `#22d3ee` / `#67e8f9` | Business interactive color   |
| `--accent-contrast`      | `#ffffff`              | `#06121f`               | Text on accent backgrounds   |
| `--tech-accent` / `--tech-glow` | `#0e7490` / `#06b6d4` | `#22d3ee` / `#22d3ee` | HUD labels; glow decoration  |
| `--border-default`/`-strong` | `#e4e4e7` / `#d4d4d8` | `#1e2a3a` / `#2e3d52` | Structural lines             |
| `--focus-ring`           | `#0891b2`              | `#22d3ee`               | Focus outlines (cyan = tech) |
| `--selection-bg`         | `#bfdbfe`              | `#164e63`               | Text selection               |
| `--accent-soft`          | `#eff6ff`              | `#12283a`               | Low-emphasis accent fills    |
| `--grid-line`            | `rgba(30,64,175,.06)`  | `rgba(148,163,184,.06)` | Hero fine-grid backdrop      |
| `--glass-bg`             | `rgba(255,255,255,.78)` | `rgba(10,15,30,.68)`  | Glass surfaces               |
| `--glow-ring`            | cyan ring + soft glow  | stronger cyan ring+glow | Card hover glow shadow       |

`presetWind3` (full Tailwind palette) is intentionally disabled — only
`presetMini` + `presetTypography` run — so classes like `text-red-500`
don't exist here; if a new color is needed, add a token to `app.css` +
`uno.config.ts` rather than reaching for a raw Tailwind shade.

Hardcoded-color exceptions (all deliberate, all in the "dark device"
surfaces, identical in both themes):

- The theater section (`SelectedSystems.astro`) and contact section
  (`ProfileContact.astro`) are always-dark blocks: `#070b16` background,
  `#eef2fa` text, `#1c2a42` borders, `#22d3ee` accents. They read as
  "instruments" even in light mode, so they don't take theme tokens.
- The terminal's macOS traffic lights (`#ff6058`/`#ffbd2e`/`#28c93f`,
  [`terminal.css:156-158`](src/components/terminal/terminal.css)) — chrome
  skeuomorphism, not theme content.

## Typography

- Fonts: **Geist Variable** is what actually renders (self-hosted via
  `@fontsource-variable/geist`, imported in
  [`app.css:1`](src/assets/styles/app.css)); `--font-sans` lists
  'Instrument Sans' first as a fallback stack with Noto Sans SC /
  PingFang SC for CJK. Set once on `html` — don't re-declare
  `font-family` per component.
- Monospace: **JetBrains Mono**, fallback stack
  `'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace`.
  Its role is the tech instrument layer: HUD labels, section eyebrows,
  status readouts, data rows (`time`/`dt` elements), the theater's index
  numbers — not general emphasis; don't add `font-mono` to ordinary prose.
- Hero `h1` is weight 700 with `-0.045em` tracking
  ([`HomePage.astro`](src/components/home/HomePage.astro)); section `h2`s
  are 600 with `-0.035em`. Prose (blog/notes body copy) uses
  `presetTypography` via the `prose text-base text-muted-foreground` class
  combo; headings inside prose are `font-weight: 500`, `strong` is 600,
  links are 500 — don't fight these with inline weight utilities.
- Mono HUD labels pair `font-family: var(--font-mono)` with `--text-xs`,
  600 weight and `0.1em`-`0.12em` tracking, colored `--tech-accent`. The
  hero eyebrow adds `[ ` / ` ]` brackets via pseudo-elements
  ([`HomePage.astro`](src/components/home/HomePage.astro)).

## Layout

No custom spacing scale — default 0.25rem-increment scale. Homepage
sections use a shared container idiom: `width: min(1200px,
calc(100% - 64px))`, narrowing to `-48px` ≤1023px and `-40px` ≤767px.

Two idioms recur enough to be conventions:

- Icon buttons: `size-5` content box with `p-1.5` (6px) padding.
- Card padding: `p-4`/`p-5 sm:p-6`, or `var(--space-6)` in the homepage
  redesign components.

### Breakpoints

Utility classes use default Tailwind/UnoCSS breakpoints (`sm:`, `md:`,
etc.). Scoped `<style>` blocks (where UnoCSS doesn't generate responsive
variants) fall back to raw `@media` queries — use `640px` for the mobile
cutoff and `768px` for the tablet cutoff, unless you have a specific
reason to diverge.

## Elevation & Depth

No shadow token/CSS var for generic shadows — the homepage redesign added
`--glow-ring` (cyan ring + soft glow, per-theme) as the hover treatment
for interactive cards. Three idioms, pick based on context:

- **Interactive card hover** (business cards: lab cards, featured post):
  navy border (`border-color: var(--signal-accent)`) + `translateY(-4px)`
  on a spring easing `cubic-bezier(0.34, 1.56, 0.64, 1)` (borrowed from
  YourMind's interaction language) + `box-shadow: var(--glow-ring)`. The
  spring is the one place motion is allowed to feel "tech".
- **Ambient elevation on static surfaces**: a soft shadow tied to the
  foreground token, e.g. `box-shadow: 0 14px 38px hsl(var(--foreground) /
  0.06)`. Prefer this over hardcoded rgba.
- **Instrument glow** (always-dark surfaces): `box-shadow: 0 0 72px -28px
  color-mix(in srgb, var(--theater-accent) 45%, transparent)` on the
  theater evidence frame, `--shadow-terminal` (now cyan-tinted) on the
  terminal.

## Motion

### Existing conventions (unchanged)

- **No instant state swaps** — see [Blurred Icon Transition](#blurred-icon-transition).
- **Blurred Icon Transition**: the default crossfade for controls that swap
  between icons/labels — stack states absolutely, outgoing blurs to
  `opacity:0; blur(4px); scale(0.6)`, incoming from the inverse, over
  `0.25s ease`.
- **Always respect reduced motion**: every animation must have a
  `@media (prefers-reduced-motion: reduce)` override (the global rule in
  [`app.css`](src/assets/styles/app.css) neutralizes transitions and
  animations site-wide; JS-driven effects must additionally gate on
  `matchMedia('(prefers-reduced-motion: reduce)')`).

### Redesign additions

- **Hero scan line**: a 48px cyan gradient band sweeps top-to-bottom over
  the terminal HUD frame every 7s (`hero-scan` keyframes in
  [`HomePage.astro`](src/components/home/HomePage.astro)). Clipped by the
  frame's `overflow: hidden`; killed by the global reduced-motion rule.
- **3D tilt**: the hero terminal panel tilts ±2.5° toward the pointer
  (CSS variables `--rx`/`--ry` on a `perspective(1100px)` wrapper, eased
  `240ms ease-out`). JS gates it to `(hover: hover) and (pointer: fine)`
  devices and non-reduced-motion. This is the "subtle 3D" answer — no
  Three.js payload.
- **Hover glow**: business cards get `--glow-ring` on hover (see
  Elevation); primary buttons get `box-shadow: 0 0 28px -6px
  color-mix(in srgb, var(--tech-glow) 60%, transparent)`.
- Micro-interaction timings stay 150-300ms; the 240ms spring is the upper
  bound.

## Shapes

`--radius: 0.5rem` (8px) remains the canonical system radius. The
practical convention lives in which radius utility each layer uses:

- **`rounded-md`** (6px) — compact controls.
- **`rounded-lg`** (8px) — the default for cards and list items.
- **`rounded-xl`/`rounded-2xl`** (12px/16px) — hero-level containers.
- **`rounded-full`** — avatars, status dots, pill badges.

Business sharpness is deliberate: 8-12px radii on white cards read
corporate; the terminal sub-theme keeps its own `--wt-radius: 0.85rem`.

## Components

No component token library — patterns are established by precedent:

- **Icon button**: `size-5` box, `p-1.5` padding, `rounded-md`,
  `hover:bg-border` (or `hover:bg-muted`), `transition-colors`.
- **Interactive card**: business cards follow the hover idiom in
  [Elevation](#elevation--depth).
- **HUD frame**: four corner brackets (`<i>` elements, 16-18px, one or two
  borders each, `border-color: var(--tech-glow)` / `--theater-accent`,
  subtle `drop-shadow` glow) at the corners of an instrument surface —
  used around the hero terminal (inset `-10px`, `overflow: hidden` shell
  that also clips the scan line) and the theater evidence frame. Reuse
  this markup pattern for any new framed instrument surface; note the
  corner borders must be set with width/style longhands (a `border-top:
  1px solid` shorthand would reset the color to currentColor).
- **Icon/label swap control**: see [Blurred Icon Transition](#blurred-icon-transition).

## Do's and Don'ts

- Do use the semantic tokens (`bg-muted`, `text-primary`, `--signal-accent`,
  `--tech-accent`), never a raw Tailwind palette color or a literal hex in
  a themed component.
- Do keep the two accents in their roles: mono labels → `--tech-accent`,
  interactive → `--signal-accent`.
- Don't add `font-mono` outside the instrument/terminal/dev-mode layer.
- Do use the `hsl(var(--foreground) / <alpha>)` shadow idiom for new
  elevated surfaces; don't hand-roll another hardcoded rgba shadow stack.
- Don't invent a new scoped `@media` breakpoint — reuse `640px`/`768px`.
- Don't swap a control's icon/label with `display:none`/`display:block` —
  use the Blurred Icon Transition instead.
- Do keep the terminal/dev-mode/mascot sub-theme inside its own token set
  (`--wt-*`, `--term-*`) rather than pulling in global tokens.
- Do add a reduced-motion override for every new animation, and gate
  JS-driven motion on `matchMedia` checks.

## Sub-themes

The terminal / dev-mode / mascot surfaces (`terminal.css`, `devmode.css`,
`mascot/jojo.css`) are a deliberate visual layer on top of the base
tokens, not a bug to normalize away. The redesign hue-shifted the
terminal's `--wt-*` set from green to the mission-console palette
(navy surfaces `#0d1424`, cyan accent `#22d3ee`, border `#1c2a42`) so the
device matches its new HUD frame while keeping its own radius
(`--wt-radius: 0.85rem`) and mono-first typography.

The theater (`SelectedSystems.astro`) and contact
(`ProfileContact.astro`) sections are always-dark instrument blocks with
their own local palette (see [Colors](#colors)) — they don't respond to
theme switching.
