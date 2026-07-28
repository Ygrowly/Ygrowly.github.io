import type { Lang } from '@/i18n/ui'

type PostEntry = {
  id: string
  data: {
    draft: boolean
    publishDate: Date
    translationKey?: string
  }
}

type NoteEntry = {
  id: string
  data: {
    draft: boolean
    date: Date
    updatedDate?: Date
    translationKey?: string
  }
}

export function selectPublishedPosts<T extends PostEntry>(
  entries: T[],
  lang: Lang,
  limit: number,
  now = new Date()
) {
  return [...entries]
    .filter(
      (entry) =>
        !entry.data.draft &&
        entry.data.publishDate <= now &&
        (lang === 'zh' || Boolean(entry.data.translationKey))
    )
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
    .slice(0, limit)
}

export function selectPublishedNotes<T extends NoteEntry>(
  entries: T[],
  lang: Lang,
  limit: number,
  now = new Date()
) {
  return [...entries]
    .filter(
      (entry) =>
        !entry.data.draft &&
        entry.data.date <= now &&
        (lang === 'zh' || Boolean(entry.data.translationKey))
    )
    .sort(
      (a, b) =>
        (b.data.updatedDate ?? b.data.date).getTime() -
        (a.data.updatedDate ?? a.data.date).getTime()
    )
    .slice(0, limit)
}

export function postHref(entry: PostEntry, lang: Lang) {
  const slug = lang === 'en' ? entry.data.translationKey : entry.id
  return `${lang === 'en' ? '/en' : ''}/blog/${slug}`
}

export function noteHref(entry: NoteEntry, lang: Lang) {
  const slug = lang === 'en' ? entry.data.translationKey : entry.id
  return `${lang === 'en' ? '/en' : ''}/notes/${slug}`
}
