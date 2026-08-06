import { useEffect, useState, type CSSProperties, type RefCallback } from 'react'
import { createPortal } from 'react-dom'

import type { InterviewQuestion } from './interview-question-types'

interface Props {
  cardRef: RefCallback<HTMLElement>
  index: number
  isOpen: boolean
  isViewed: boolean
  modalOrigin: { x: number; y: number } | null
  onClose: () => void
  onToggle: (trigger: HTMLElement) => void
  question: InterviewQuestion
}

function renderInlineText(value: string) {
  return value.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>
    }

    return <span key={`${part}-${index}`}>{part}</span>
  })
}

function AnswerText({ answer }: { answer: string }) {
  return (
    <div className='iq-answer-copy'>
      {answer.split(/\n\s*\n/).map((paragraph, index) => (
        <p key={`${paragraph.slice(0, 24)}-${index}`}>{renderInlineText(paragraph)}</p>
      ))}
    </div>
  )
}

export default function InterviewQuestionCard({
  cardRef,
  index,
  isOpen,
  isViewed,
  modalOrigin,
  onClose,
  onToggle,
  question
}: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const number = String(index + 1).padStart(2, '0')
  const legacyId = `q${index + 1}`
  const answerId = `${question.id}-answer`
  const triggerId = `${question.id}-trigger`

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const answerDialog = (
    <div
      id={answerId}
      className={`iq-answer${isOpen ? ' is-open' : ''}`}
      role='dialog'
      aria-modal='true'
      aria-labelledby={`${answerId}-title`}
      aria-hidden={!isOpen}
      hidden={!isOpen}
      tabIndex={-1}
      style={
        modalOrigin
          ? ({
              '--iq-modal-origin-x': `${modalOrigin.x}px`,
              '--iq-modal-origin-y': `${modalOrigin.y}px`
            } as CSSProperties)
          : undefined
      }
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className='iq-answer-dialog'>
        <div className='iq-modal-header'>
          <div className='iq-modal-heading'>
            <div className='iq-modal-topline'>
              <span className='iq-number'>Q{number}</span>
              <span className='iq-category'>{question.category}</span>
            </div>
            <p id={`${answerId}-title`} className='iq-modal-question'>
              {renderInlineText(question.question)}
            </p>
          </div>
          <button type='button' className='iq-modal-close' onClick={onClose}>
            <span aria-hidden='true'>×</span>
            <span className='sr-only'>返回问题</span>
          </button>
        </div>

        <div className='iq-answer-grid'>
          <div className='iq-answer-main'>
            <div className='iq-panel'>
              <p className='iq-panel-label'>面试标答</p>
              <AnswerText answer={question.answer} />
            </div>

            {question.relatedSection && (
              <a className='iq-related-link' href={question.relatedSection.href}>
                <span>{question.relatedSection.label}</span>
                <span aria-hidden='true'>↗</span>
              </a>
            )}
          </div>

          <div className='iq-answer-side'>
            <div className='iq-panel'>
              <p className='iq-panel-label'>答题结构</p>
              <ol className='iq-structure-list'>
                {question.answerStructure.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>

            <div className='iq-panel'>
              <p className='iq-panel-label'>实现证据</p>
              <ul className='iq-evidence-list'>
                {question.evidence.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a href={item.href} target='_blank' rel='noreferrer'>
                        {renderInlineText(item.label)}
                      </a>
                    ) : (
                      renderInlineText(item.label)
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className='iq-panel'>
              <p className='iq-panel-label'>追问方向</p>
              <ul className='iq-follow-up-list'>
                {question.followUps.map((followUp) => (
                  <li key={followUp}>{renderInlineText(followUp)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <article
      ref={cardRef}
      id={question.id}
      className={`iq-card${isOpen ? ' is-open' : ''}${isViewed ? ' is-viewed' : ''}`}
      data-open={isOpen}
      data-question-id={question.id}
      data-viewed={isViewed}
    >
      <span id={legacyId} className='iq-legacy-anchor' aria-hidden='true' />

      <div className='iq-card-header'>
        <button
          id={triggerId}
          type='button'
          className={`iq-card-toggle${isOpen ? ' is-open' : ''}`}
          aria-controls={answerId}
          aria-expanded={isOpen}
          onClick={(event) => onToggle(event.currentTarget)}
        >
          <span className='iq-card-topline'>
            <span className='iq-number'>Q{number}</span>
            <span className='iq-category'>{question.category}</span>
          </span>

          <span className='iq-question'>{renderInlineText(question.question)}</span>

          {!isOpen && (
            <>
              <span className='iq-key-points'>
                <span className='iq-key-points-label'>考察：</span>
                {question.keyPoints.join(' · ')}
              </span>
              <span className='iq-card-hint'>先回答，再查看标答 →</span>
            </>
          )}
        </button>
      </div>

      {isMounted ? createPortal(answerDialog, document.body) : answerDialog}
    </article>
  )
}
