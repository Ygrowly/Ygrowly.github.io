import type { MarkdownHeading } from 'astro'

export interface TocItem {
  depth: number
  isRoot: boolean
  slug: string
  text: string
  subheadings: TocItem[]
}

export function generateToc(rawHeadings: readonly MarkdownHeading[]) {
  const bodyHeadings = rawHeadings.filter(({ depth }) => depth >= 1)
  const toc: TocItem[] = []
  const parents: TocItem[] = []

  bodyHeadings.forEach((h) => {
    while (parents.length && parents[parents.length - 1]!.depth >= h.depth) {
      parents.pop()
    }

    const parent = parents[parents.length - 1]
    const heading: TocItem = { ...h, isRoot: !parent, subheadings: [] }

    if (parent) {
      parent.subheadings.push(heading)
    } else {
      toc.push(heading)
    }

    parents.push(heading)
  })

  return toc
}
