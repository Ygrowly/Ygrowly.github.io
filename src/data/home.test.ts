import { hasEnAlternate, withLangPrefix } from '@/i18n/ui'
import { resolvedResume } from '@/lib/resume'
import { describe, expect, test } from 'bun:test'

import { homeContent, projectCases } from './home'

describe('homepage configuration', () => {
  test('keeps the required project order and PayTrace in the lab', () => {
    expect(homeContent.zh.systems.projects.map((project) => project.slug)).toEqual([
      'energyops-agent',
      'ai-bi-platform'
    ])
    expect(homeContent.zh.lab.items.find((item) => item.name === 'PayTrace')?.status).toBe(
      'Building'
    )
    expect(projectCases.zh.find((project) => project.slug === 'paytrace')?.eyebrow).toContain(
      'Building'
    )
  })

  test('keeps bilingual homepage routes and translation fallback helpers stable', () => {
    expect(hasEnAlternate('/')).toBe(true)
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
