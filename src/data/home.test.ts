import { hasEnAlternate, withLangPrefix } from '@/i18n/ui'
import { resolvedResume } from '@/lib/resume'
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

  test('falls back to the Chinese résumé when an English PDF is absent', () => {
    const resume = resolvedResume('en')
    if (resume.fallbackToChinese) {
      expect(resume.href).toBe('/resume.pdf')
    } else {
      expect(resume.href).toBe('/resume-en.pdf')
    }
  })
})
