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

  // "Show me the code" is the first thing a technical reader asks. Every case
  // page has to answer it — with a link, or with a reason there isn't one.
  test('answers where the code is for every case page', () => {
    for (const projects of [projectCases.zh, projectCases.en]) {
      for (const project of projects) {
        const hasLinks = (project.links?.length ?? 0) > 0
        const hasNote = !!project.sourceNote
        expect(`${project.slug}: ${hasLinks || hasNote}`).toBe(`${project.slug}: true`)

        for (const link of project.links ?? []) {
          expect(link.href.startsWith('https://') || link.href.startsWith('/')).toBe(true)
          expect(link.label.trim()).not.toBe('')
        }

        if (project.sourceNote) {
          expect(project.sourceNote.title.trim()).not.toBe('')
          expect(project.sourceNote.body.trim()).not.toBe('')
          expect(project.sourceNote.instead.length).toBeGreaterThan(0)
          for (const item of project.sourceNote.instead) {
            expect(item.trim()).not.toBe('')
          }
        }
      }
    }
  })

  test('links public repositories and explains the closed company systems', () => {
    for (const projects of [projectCases.zh, projectCases.en]) {
      const bySlug = new Map(projects.map((project) => [project.slug, project]))

      for (const slug of ['rulearena', 'paytrace']) {
        const hrefs = bySlug.get(slug)?.links?.map((link) => link.href) ?? []
        expect(hrefs.some((href) => href.startsWith('https://github.com/Ygrowly/'))).toBe(true)
      }

      for (const slug of ['energyops-agent', 'ai-bi-platform']) {
        const project = bySlug.get(slug)
        expect(project?.links).toBeUndefined()
        expect(project?.sourceNote).toBeDefined()
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
