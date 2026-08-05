import { useCallback, useRef, useState } from 'react'

import type { InterviewQuestion } from './interview-question-types'
import { markInterviewQuestionViewed, toggleInterviewQuestion } from './interview-question-state'
import InterviewQuestionCard from './InterviewQuestionCard'
import './interview-question-deck.css'

interface Props {
  questions: InterviewQuestion[]
}

export default function InterviewQuestionDeck({ questions }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [viewedIds, setViewedIds] = useState<Set<string>>(() => new Set())
  const cardRefs = useRef<Record<string, HTMLElement | null>>({})

  const setViewed = useCallback((id: string) => {
    setViewedIds((current) => markInterviewQuestionViewed(current, id))
  }, [])

  const focusCardTrigger = useCallback((id: string) => {
    window.requestAnimationFrame(() => {
      document.getElementById(`${id}-trigger`)?.focus({ preventScroll: true })
    })
  }, [])

  const toggleQuestion = useCallback(
    (id: string) => {
      setViewed(id)
      setOpenId((current) => toggleInterviewQuestion(current, id))
    },
    [setViewed]
  )

  const closeQuestion = useCallback(
    (id: string) => {
      setOpenId(null)
      focusCardTrigger(id)
    },
    [focusCardTrigger]
  )

  const navigateToQuestion = useCallback(
    (id: string) => {
      setViewed(id)
      setOpenId(id)

      window.requestAnimationFrame(() => {
        const card = cardRefs.current[id] ?? document.getElementById(id)
        if (!card) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
        focusCardTrigger(id)
      })
    },
    [focusCardTrigger, setViewed]
  )

  return (
    <section
      className='interview-question-deck not-prose'
      aria-label='Pi Agent 面试问题卡'
      data-question-count={questions.length}
    >
      <div className='iq-deck-intro'>
        <div>
          <p className='iq-deck-eyebrow'>自测入口</p>
          <p className='iq-deck-description'>
            先按自己的理解回答，再翻面核对面试标答、答题结构与实现证据。
          </p>
        </div>
        <span className='iq-deck-count'>{questions.length} 题</span>
      </div>

      <nav className='iq-question-nav' aria-label='问题卡导航'>
        {questions.map((question, index) => {
          const number = String(index + 1).padStart(2, '0')
          const isCurrent = openId === question.id
          const isViewed = viewedIds.has(question.id)

          return (
            <button
              key={question.id}
              type='button'
              className={`iq-nav-button${isCurrent ? ' is-current' : ''}${isViewed ? ' is-viewed' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`跳到问题 ${index + 1}`}
              data-viewed={isViewed}
              onClick={() => navigateToQuestion(question.id)}
            >
              <span>{number}</span>
              {isViewed && <span className='iq-viewed-dot' aria-hidden='true' />}
            </button>
          )
        })}
      </nav>

      <div className='iq-card-grid'>
        {questions.map((question, index) => (
          <InterviewQuestionCard
            key={question.id}
            cardRef={(node) => {
              cardRefs.current[question.id] = node
            }}
            index={index}
            isOpen={openId === question.id}
            isViewed={viewedIds.has(question.id)}
            onClose={() => closeQuestion(question.id)}
            onToggle={() => toggleQuestion(question.id)}
            question={question}
          />
        ))}
      </div>
    </section>
  )
}
