import { hasEnAlternate, withLangPrefix } from '@/i18n/ui'
import { describe, expect, test } from 'bun:test'

import { homeContent, projectCases } from './home'

describe('homepage configuration', () => {
  test('keeps the required project order, PayTrace in the theater, and Ovanta in the lab', () => {
    expect(homeContent.zh.systems.projects.map((project) => project.slug)).toEqual([
      'energyops-agent',
      'ai-bi-platform',
      'paytrace'
    ])
    expect(
      homeContent.zh.systems.projects.find((project) => project.slug === 'paytrace')?.eyebrow
    ).toContain('Independent Lab')
    expect(homeContent.zh.lab.items.find((item) => item.name === 'Ovanta')?.status).toBe('Live')
    expect(projectCases.zh.map((project) => project.slug)).toContain('ovanta')
    expect(projectCases.zh.find((project) => project.slug === 'paytrace')?.eyebrow).toContain(
      'Independent Lab'
    )
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
})
