import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'bun:test'

describe('critical blog layout shell', () => {
  test('keeps the first paint aligned with the final desktop layout', () => {
    const baseLayout = readFileSync(new URL('./BaseLayout.astro', import.meta.url), 'utf8')
    const globalStyles = readFileSync(
      new URL('../../public/styles/global.css', import.meta.url),
      'utf8'
    )

    expect(baseLayout).toContain("id={chrome && !home ? 'site-shell' : undefined}")
    expect(baseLayout).not.toContain("class='flex justify-center bg-background text-foreground'")
    expect(globalStyles).toContain('#site-shell')
    expect(globalStyles).toContain('display: block')
    expect(globalStyles).toContain('margin-inline: auto')
    expect(globalStyles).toContain('#main-content > main:not(.home-page)')
    expect(globalStyles).toContain('.site-header')
    expect(globalStyles).toContain('max-width: 70rem')
    expect(globalStyles).toContain('column-gap: 2.5rem')
  })
})
