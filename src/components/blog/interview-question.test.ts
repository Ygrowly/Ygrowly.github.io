import { readFileSync } from 'node:fs'
import { piAgentInterviewQuestions } from '@/data/interview/pi-agent-questions'
import { describe, expect, test } from 'bun:test'

import { markInterviewQuestionViewed, toggleInterviewQuestion } from './interview-question-state'

describe('Pi Agent interview question deck data', () => {
  test('keeps a complete, ordered q01-q15 set with answer content', () => {
    expect(piAgentInterviewQuestions).toHaveLength(15)
    expect(piAgentInterviewQuestions.map(({ id }) => id)).toEqual(
      Array.from({ length: 15 }, (_, index) => `q${String(index + 1).padStart(2, '0')}`)
    )

    for (const question of piAgentInterviewQuestions) {
      expect(question.question.length).toBeGreaterThan(0)
      expect(question.keyPoints.length).toBeGreaterThanOrEqual(3)
      expect(question.answer.length).toBeGreaterThan(80)
      expect(question.answerStructure.length).toBeGreaterThanOrEqual(3)
      expect(question.evidence.length).toBeGreaterThan(0)
      expect(question.followUps.length).toBeGreaterThanOrEqual(2)
      expect(question.relatedSection?.href).toMatch(/^#第-/)
    }
  })

  test('allows only one open question and records viewed questions for this lifecycle', () => {
    expect(toggleInterviewQuestion(null, 'q01')).toBe('q01')
    expect(toggleInterviewQuestion('q01', 'q02')).toBe('q02')
    expect(toggleInterviewQuestion('q02', 'q02')).toBeNull()

    const viewed = markInterviewQuestionViewed(new Set<string>(), 'q01')
    expect([...viewed]).toEqual(['q01'])
    expect(markInterviewQuestionViewed(viewed, 'q01')).toBe(viewed)
    expect([...markInterviewQuestionViewed(viewed, 'q02')]).toEqual(['q01', 'q02'])
  })

  test('keeps the article and card styling out of the global heading/scroll contracts', () => {
    const article = readFileSync(
      new URL(
        '../../content/blog/20260801 - pi-agent-runtime-coding-harness/post.mdx',
        import.meta.url
      ),
      'utf8'
    )
    const card = readFileSync(new URL('./InterviewQuestionCard.tsx', import.meta.url), 'utf8')
    const styles = readFileSync(new URL('./interview-question-deck.css', import.meta.url), 'utf8')

    expect(article).toContain(
      '<InterviewQuestionDeck questions={piAgentInterviewQuestions} client:load />'
    )
    expect(article).not.toContain('## Q1：')
    expect(article).not.toContain('### 面试标答')
    expect(styles).toContain('grid-template-columns: repeat(2, minmax(0, 1fr))')
    expect(styles).toContain('position: fixed')
    expect(styles).toContain('.iq-answer-dialog')
    expect(styles).toContain('.iq-answer[hidden]')
    expect(styles).toContain('@keyframes iq-modal-dialog-in')
    expect(card).toContain('createPortal(answerDialog, document.body)')

    const answerDialogStyles = styles.split('.iq-answer-dialog')[1]?.split('}')[0] ?? ''
    expect(answerDialogStyles).not.toMatch(/overflow\s*:\s*(auto|scroll)/)
    expect(styles).toContain('prefers-reduced-motion: reduce')
  })
})
