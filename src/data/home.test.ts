import { hasEnAlternate, withLangPrefix } from '@/i18n/ui'
import { describe, expect, test } from 'bun:test'

import { homeContent, projectCases } from './home'

describe('homepage configuration', () => {
  test('keeps the required project order, RuleArena in the theater, and PayTrace in the lab', () => {
    expect(homeContent.zh.systems.projects.map((project) => project.slug)).toEqual([
      'energyops-agent',
      'ai-bi-platform',
      'rulearena'
    ])
    expect(
      homeContent.zh.systems.projects.find((project) => project.slug === 'rulearena')?.eyebrow
    ).toContain('Personal Project')
    expect(
      homeContent.zh.lab.items.find((item) => item.name === 'Ovanta')?.status
    ).toBe('Live')
    expect(homeContent.zh.lab.items.find((item) => item.name === 'PayTrace')).toBeDefined()
    expect(projectCases.zh.map((project) => project.slug)).toContain('ovanta')
    expect(projectCases.zh.map((project) => project.slug)).toContain('rulearena')
  })

  test('keeps bilingual homepage routes and translation fallback helpers stable', () => {
    expect(hasEnAlternate('/')).toBe(true)
    expect(hasEnAlternate('/experience')).toBe(true)
    expect(withLangPrefix('/', 'en')).toBe('/en')
    expect(withLangPrefix('/about', 'en')).toBe('/en/about')
  })

  test('does not expose résumé entry points in homepage content', () => {
    for (const content of [homeContent.zh, homeContent.en]) {
      expect(content.hero).not.toHaveProperty('resume')
      expect(content.contact).not.toHaveProperty('resume')
    }
  })

  test('gives every project case the three depth sections', () => {
    for (const projects of [projectCases.zh, projectCases.en]) {
      for (const project of projects) {
        expect(project.tradeoffs.length).toBeGreaterThan(0)
        expect(project.outOfScope.length).toBeGreaterThan(0)
        expect(project.openQuestions.length).toBeGreaterThan(0)

        for (const { decision, why, cost } of project.tradeoffs) {
          expect(decision.trim()).not.toBe('')
          expect(why.trim()).not.toBe('')
          expect(cost.trim()).not.toBe('')
        }
      }
    }
  })

  test('withholds detail-only evidence rows from the homepage theater', () => {
    const forHome = (project: (typeof projectCases.zh)[number]) =>
      project.evidence.filter((item) => !item.detailOnly)

    const rulearena = projectCases.zh.find((project) => project.slug === 'rulearena')
    const discovery = rulearena?.evidence.find((item) => item.label === 'Discovery')

    expect(discovery?.detailOnly).toBe(true)
    expect(rulearena && forHome(rulearena)).not.toContain(discovery)

    for (const project of projectCases.zh) {
      expect(forHome(project).length).toBeGreaterThan(0)
    }
  })
})
