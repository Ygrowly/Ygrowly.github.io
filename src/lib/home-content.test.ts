import { describe, expect, test } from 'bun:test'

import { noteHref, postHref, selectPublishedNotes, selectPublishedPosts } from './home-content'

const now = new Date('2026-07-27T00:00:00Z')

describe('homepage content selection', () => {
  test('selects published posts newest first and excludes drafts and future entries', () => {
    const posts = [
      {
        id: 'older',
        data: { draft: false, publishDate: new Date('2026-01-01'), translationKey: 'older' }
      },
      {
        id: 'future',
        data: { draft: false, publishDate: new Date('2026-08-01'), translationKey: 'future' }
      },
      {
        id: 'draft',
        data: { draft: true, publishDate: new Date('2026-07-01'), translationKey: 'draft' }
      },
      {
        id: 'latest',
        data: { draft: false, publishDate: new Date('2026-07-01'), translationKey: 'latest' }
      }
    ]

    expect(selectPublishedPosts(posts, 'zh', 2, now).map((entry) => entry.id)).toEqual([
      'latest',
      'older'
    ])
  })

  test('does not leak untranslated entries into English selections', () => {
    const posts = [
      { id: 'zh-only', data: { draft: false, publishDate: new Date('2026-07-02') } },
      {
        id: 'translated.en',
        data: { draft: false, publishDate: new Date('2026-07-01'), translationKey: 'translated' }
      }
    ]

    expect(selectPublishedPosts(posts, 'en', 2, now).map((entry) => entry.id)).toEqual([
      'translated.en'
    ])
  })

  test('sorts notes by updated date and builds translated routes', () => {
    const notes = [
      {
        id: 'older',
        data: {
          draft: false,
          date: new Date('2026-01-01'),
          updatedDate: new Date('2026-07-20'),
          translationKey: 'older'
        }
      },
      {
        id: 'newer',
        data: {
          draft: false,
          date: new Date('2026-07-01'),
          translationKey: 'newer'
        }
      }
    ]

    const selected = selectPublishedNotes(notes, 'en', 3, now)
    expect(selected.map((entry) => entry.id)).toEqual(['older', 'newer'])
    expect(postHref({ id: 'post.en', data: postsData('post') }, 'en')).toBe('/en/blog/post')
    expect(noteHref(selected[0], 'en')).toBe('/en/notes/older')
  })
})

function postsData(translationKey: string) {
  return {
    draft: false,
    publishDate: new Date('2026-01-01'),
    translationKey
  }
}
