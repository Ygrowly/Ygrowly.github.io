import { useCallback, useEffect, useRef, useState } from 'react'

import { markInterviewQuestionViewed, toggleInterviewQuestion } from './interview-question-state'
import type { InterviewQuestion } from './interview-question-types'
import InterviewQuestionCard from './InterviewQuestionCard'

import './interview-question-deck.css'

interface Props {
  questions: InterviewQuestion[]
}

interface ModalOrigin {
  x: number
  y: number
}

function getModalOrigin(element: HTMLElement): ModalOrigin {
  const rect = element.getBoundingClientRect()

  return {
    x: rect.left + rect.width / 2 - window.innerWidth / 2,
    y: rect.top + rect.height / 2 - window.innerHeight / 2
  }
}

export default function InterviewQuestionDeck({ questions }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [viewedIds, setViewedIds] = useState<Set<string>>(() => new Set())
  const [modalOrigin, setModalOrigin] = useState<ModalOrigin | null>(null)
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
    (id: string, trigger: HTMLElement) => {
      setViewed(id)
      setModalOrigin(getModalOrigin(trigger))
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
      const card = cardRefs.current[id]
      if (card) setModalOrigin(getModalOrigin(card))
      setOpenId(id)

      window.requestAnimationFrame(() => {
        const card = cardRefs.current[id] ?? document.getElementById(id)
        if (!card) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
      })
    },
    [setViewed]
  )

  useEffect(() => {
    if (!openId) return

    const dialog = document.getElementById(`${openId}-answer`)
    if (!dialog) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusFrame = window.requestAnimationFrame(() => {
      dialog.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeQuestion(openId)
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getAttribute('aria-hidden') !== 'true')

      if (!focusable.length) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (!dialog.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeQuestion, openId])

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
            onToggle={(trigger) => toggleQuestion(question.id, trigger)}
            modalOrigin={openId === question.id ? modalOrigin : null}
            question={question}
          />
        ))}
      </div>
    </section>
  )
}
