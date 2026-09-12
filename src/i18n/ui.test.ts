import { describe, expect, test } from 'bun:test'

import { getLangFromUrl, hasEnAlternate, stripLangPrefix, withLangPrefix } from './ui'

describe('getLangFromUrl', () => {
  test('reads the language from the leading segment', () => {
    expect(getLangFromUrl(new URL('https://ygrowly.github.io/'))).toBe('zh')
    expect(getLangFromUrl(new URL('https://ygrowly.github.io/en'))).toBe('en')
    expect(getLangFromUrl(new URL('https://ygrowly.github.io/en/about'))).toBe('en')
    expect(getLangFromUrl(new URL('https://ygrowly.github.io/about'))).toBe('zh')
  })

  // build.format: 'file' — the /en page reports itself as /en.html, which a
  // naive leading-segment read mistakes for a Chinese page.
  test('still finds English when the path carries a build extension', () => {
    expect(getLangFromUrl(new URL('https://ygrowly.github.io/en.html'))).toBe('en')
    expect(getLangFromUrl(new URL('https://ygrowly.github.io/en/about.html'))).toBe('en')
    expect(getLangFromUrl(new URL('https://ygrowly.github.io/index.html'))).toBe('zh')
  })

  test('accepts a bare pathname string', () => {
    expect(getLangFromUrl('/en/projects')).toBe('en')
    expect(getLangFromUrl('/projects')).toBe('zh')
  })
})

describe('hasEnAlternate', () => {
  test('mirrored section pages', () => {
    expect(hasEnAlternate('/')).toBe(true)
    expect(hasEnAlternate('/projects')).toBe(true)
    expect(hasEnAlternate('/experience')).toBe(true)
    expect(hasEnAlternate('/about')).toBe(true)
  })

  test('project case pages exist in both languages', () => {
    expect(hasEnAlternate('/projects/rulearena')).toBe(true)
    expect(hasEnAlternate('/projects/paytrace')).toBe(true)
  })

  test('the paginated list is mirrored, detail pages are not', () => {
    expect(hasEnAlternate('/blog')).toBe(true)
    expect(hasEnAlternate('/blog/2')).toBe(true)
    expect(hasEnAlternate('/blog/20260911---pass-k-reliability-eval/post')).toBe(false)
    expect(hasEnAlternate('/notes/0326-foo')).toBe(false)
  })

  // The trailing-slash experiment silently killed every hreflang on the site,
  // because these are exact-string comparisons. Keep them strict: a false
  // negative costs one missing alternate link, whereas a false positive would
  // publish an /en/... URL that 404s.
  test('does not match a path carrying a trailing slash', () => {
    expect(hasEnAlternate('/about/')).toBe(false)
    expect(hasEnAlternate('/projects/')).toBe(false)
    expect(hasEnAlternate('/en/about/')).toBe(false)
  })
})

describe('stripLangPrefix / withLangPrefix', () => {
  test('round-trips the mirrored pages', () => {
    expect(stripLangPrefix('/en/projects')).toBe('/projects')
    expect(stripLangPrefix('/en')).toBe('/')
    expect(withLangPrefix('/projects', 'en')).toBe('/en/projects')
    expect(withLangPrefix('/', 'en')).toBe('/en')
    expect(withLangPrefix('/projects', 'zh')).toBe('/projects')
  })
})
