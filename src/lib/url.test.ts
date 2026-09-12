import { describe, expect, test } from 'bun:test'

import { servedPath, servedUrl } from './url'

describe('servedPath', () => {
  test('drops the .html extension the build writes to disk', () => {
    expect(servedPath('/about.html')).toBe('/about')
    expect(servedPath('/projects/rulearena.html')).toBe('/projects/rulearena')
    expect(servedPath('/blog/20260911---pass-k-reliability-eval/post.html')).toBe(
      '/blog/20260911---pass-k-reliability-eval/post'
    )
  })

  test('maps the root index back to /', () => {
    expect(servedPath('/index.html')).toBe('/')
  })

  test('keeps the /en index at its own path, not the root', () => {
    expect(servedPath('/en/index.html')).toBe('/en/')
    expect(servedPath('/en.html')).toBe('/en')
  })

  test('leaves already-served paths alone', () => {
    expect(servedPath('/')).toBe('/')
    expect(servedPath('/en')).toBe('/en')
    expect(servedPath('/projects/rulearena')).toBe('/projects/rulearena')
  })

  test('does not touch paths that merely contain .html', () => {
    // e.g. a future route segment; only a trailing extension is a file name
    expect(servedPath('/notes/html-parsing')).toBe('/notes/html-parsing')
  })

  test('never returns an empty string', () => {
    expect(servedPath('')).toBe('/')
  })
})

describe('servedUrl', () => {
  test('resolves against the site with the extension removed', () => {
    expect(servedUrl(new URL('https://ygrowly.github.io/about.html'), 'https://ygrowly.github.io').href)
      .toBe('https://ygrowly.github.io/about')
  })

  test('keeps the root canonical at the site root', () => {
    expect(servedUrl(new URL('https://ygrowly.github.io/index.html'), 'https://ygrowly.github.io').href)
      .toBe('https://ygrowly.github.io/')
  })
})
