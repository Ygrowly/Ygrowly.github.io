import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'bun:test'

describe('Mermaid blog rendering integration', () => {
  test('connects Shiki Mermaid blocks to the blog layout renderer', () => {
    const renderer = readFileSync(new URL('./MermaidRenderer.astro', import.meta.url), 'utf8')
    const layout = readFileSync(new URL('../../layouts/BlogPost.astro', import.meta.url), 'utf8')

    expect(renderer).toContain('[data-language="mermaid"]')
    expect(renderer).toContain("await import('mermaid')")
    expect(renderer).toContain('shell.replaceWith(target)')
    expect(layout).toContain('<MermaidRenderer />')
  })

  test('keeps all Mermaid fenced blocks in the Pi Agent article', () => {
    const article = readFileSync(
      new URL(
        '../../content/blog/20260801 - pi-agent-runtime-coding-harness/post.mdx',
        import.meta.url
      ),
      'utf8'
    )

    expect(article.match(/^```mermaid$/gm) ?? []).toHaveLength(8)
  })
})
