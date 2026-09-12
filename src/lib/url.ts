/**
 * Astro is configured with `build.format: 'file'` so GitHub Pages serves
 * `/about` straight from `about.html` with no 301 to `/about/` — the redirect
 * every directory-style build pays on this host.
 *
 * The tradeoff is that `Astro.url.pathname` reports the file name
 * (`/about.html`), not the URL readers and crawlers actually use. Anything we
 * publish as a URL — canonical, hreflang, JSON-LD `@id`, the language switch
 * target, pageview keys — has to go through here first.
 */
export function servedPath(pathname: string): string {
  const stripped = pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '')
  return stripped === '' ? '/' : stripped
}

/** Same as {@link servedPath}, for the common `new URL(pathname, site)` case. */
export function servedUrl(url: URL, site?: URL | string): URL {
  return new URL(servedPath(url.pathname), site)
}
