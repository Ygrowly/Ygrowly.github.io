import { describe, expect, test } from 'bun:test'

import { generateToc } from './toc'

describe('table of contents hierarchy', () => {
  test('includes level-one sections and nests their descendants', () => {
    const toc = generateToc([
      { depth: 1, slug: 'part-one', text: 'Part one' },
      { depth: 2, slug: 'chapter-one', text: 'Chapter one' },
      { depth: 3, slug: 'section-one', text: 'Section one' },
      { depth: 2, slug: 'chapter-two', text: 'Chapter two' },
      { depth: 1, slug: 'part-two', text: 'Part two' },
      { depth: 2, slug: 'chapter-three', text: 'Chapter three' }
    ] as const)

    expect(toc.map(({ slug, isRoot }) => ({ slug, isRoot }))).toEqual([
      { slug: 'part-one', isRoot: true },
      { slug: 'part-two', isRoot: true }
    ])
    expect(toc[0]!.subheadings.map(({ slug }) => slug)).toEqual(['chapter-one', 'chapter-two'])
    expect(toc[0]!.subheadings[0]!.subheadings.map(({ slug }) => slug)).toEqual(['section-one'])
    expect(toc[1]!.subheadings.map(({ slug }) => slug)).toEqual(['chapter-three'])
  })

  test('keeps documents that start at level two supported', () => {
    const toc = generateToc([
      { depth: 2, slug: 'chapter', text: 'Chapter' },
      { depth: 3, slug: 'section', text: 'Section' }
    ] as const)

    expect(toc[0]!.isRoot).toBe(true)
    expect(toc[0]!.subheadings[0]!.slug).toBe('section')
  })
})
