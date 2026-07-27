/**
 * Static text content for the pseudo-FS. Inlined directly into the
 * manifest (small, ships once with the page). Long-form content like
 * blog posts is fetched lazily through `endpoint`.
 */

/**
 * Hostname-style label for the FS root. Surfaced in the prompt host
 * segment and as the prefix of `pwd` output (so the tree visibly
 * "lives" on this machine). Change here, propagates everywhere.
 */
export const ROOT_LABEL = 'ygrowly.devserver'

export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: 'github', href: 'https://github.com/Ygrowly' },
  { label: 'mail', href: 'mailto:lyg3044@qq.com' }
]

export const README_TEXT = `ygrowly.devserver — a pseudo-FS over my published content.

If you're an AI agent the easy path is the public knowledge index:
  GET https://ygrowly.github.io/api/knowledge/index.json
That returns the same tree you see here, plus instructions and the
endpoint dictionary. CORS is open.

If you're poking around in dev mode:
  ls               — see what's here
  search agent     — search posts and notes
  cat about        — short bio
  cat now          — what I'm working on
  cd /blog         — recent posts (each has meta / summary / post)
  cat /blog/<slug>/post  — inline read with shiki highlighting
  manifest         — same data as the public index, in this terminal
`

export const ABOUT_TEXT = `Ygrowly (刘宇广)
AI application developer · Data Science undergrad, class of 2027

I work on putting AI agents into real business systems — Python backends,
data pipelines and LLM-driven tooling that is reliable, observable and
keeps iterating after the demo.

Currently: building EnergyOps Agent (enterprise energy data + agent tool
calls) and PayTrace (cross-border payment anomaly diagnosis agent).
`

export const NOW_TEXT = `Now:

- EnergyOps Agent: raw → interval → hourly → daily pipeline, alerting loop
- PayTrace: cross-border payment anomaly attribution agent (building)
- redesigning this site's homepage
`

export const PERSONALITY_TEXT = `# personality.conf
# referenced by the boot sequence — flavor only

style:     restrained, engineering-first, keeps things observable
voice:     calm, prefers systems that outlive the demo
languages: zh-CN, en, py, ts, sql
location:  China · UTC+8
`

export const MOTD_TEXT = `Welcome to ygrowly.sh dev mode.

This is a pseudo-FS exposing my site's content as a directory tree.
Type \`help\` for commands. \`exit\` or Esc to leave.
`
