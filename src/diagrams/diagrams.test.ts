import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'

/**
 * The Archify sources under src/diagrams are the editable half; public/diagrams
 * holds the delivered, self-contained HTML the case pages link to. Nothing at
 * build time regenerates one from the other, so a source edit without a
 * re-deliver would silently ship a stale diagram. These tests are the guard.
 *
 * Regenerate with:
 *   node .claude/skills/archify/bin/archify.mjs deliver workflow \
 *     src/diagrams/<name>.workflow.json public/diagrams/<name>.html \
 *     --quality showcase --json
 */

const root = join(import.meta.dir, '..', '..')

const diagrams = [
  {
    name: 'rulearena',
    source: join(root, 'src', 'diagrams', 'rulearena.workflow.json'),
    artifact: join(root, 'public', 'diagrams', 'rulearena.html')
  }
]

type WorkflowSource = {
  nodes: { id: string; label: string }[]
  edges: { from: string; to: string }[]
  mainPath?: string[]
  cards?: { title: string; items: string[] }[]
}

describe('archify diagrams', () => {
  for (const { name, source, artifact } of diagrams) {
    describe(name, () => {
      const spec = JSON.parse(readFileSync(source, 'utf8')) as WorkflowSource
      const html = existsSync(artifact) ? readFileSync(artifact, 'utf8') : ''

      test('has a delivered artifact next to the source', () => {
        expect(html.length).toBeGreaterThan(0)
      })

      test('carries every node from the source into the delivered HTML', () => {
        for (const node of spec.nodes) {
          expect(`${node.id}:${html.includes(node.id)}`).toBe(`${node.id}:true`)
          expect(`${node.label}:${html.includes(node.label)}`).toBe(`${node.label}:true`)
        }
      })

      test('carries every card title and item into the delivered HTML', () => {
        for (const card of spec.cards ?? []) {
          expect(`${card.title}:${html.includes(card.title)}`).toBe(`${card.title}:true`)
          for (const item of card.items) {
            expect(`${item}:${html.includes(item)}`).toBe(`${item}:true`)
          }
        }
      })

      test('resolves every edge endpoint to a declared node', () => {
        const ids = new Set(spec.nodes.map((node) => node.id))
        for (const edge of spec.edges) {
          expect(`${edge.from}->${edge.to}:${ids.has(edge.from) && ids.has(edge.to)}`).toBe(
            `${edge.from}->${edge.to}:true`
          )
        }
        for (const id of spec.mainPath ?? []) {
          expect(`${id}:${ids.has(id)}`).toBe(`${id}:true`)
        }
      })
    })
  }
})
