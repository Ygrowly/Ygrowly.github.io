import { existsSync } from 'node:fs'
import type { Lang } from '@/i18n/ui'

const chineseResume = new URL('../../public/resume.pdf', import.meta.url)
const englishResume = new URL('../../public/resume-en.pdf', import.meta.url)

export function hasChineseResume() {
  return existsSync(chineseResume)
}

export function hasEnglishResume() {
  return existsSync(englishResume)
}

export function resolvedResume(lang: Lang) {
  const englishAvailable = hasEnglishResume()
  return {
    href: lang === 'en' && englishAvailable ? '/resume-en.pdf' : '/resume.pdf',
    fallbackToChinese: lang === 'en' && !englishAvailable
  }
}
