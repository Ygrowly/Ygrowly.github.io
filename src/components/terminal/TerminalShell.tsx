import { trackSiteEvent } from '@/lib/analytics'
import { useCallback, useEffect, useRef, useState } from 'react'

import { classifyTerminalCommand } from './analytics'
import { commands, completeInput } from './commands'
import { fetchSiteFs } from './fs/client'
import type { FsNode } from './fs/types'
import type { HistoryEntry, OutputLine, Tone } from './types'

import './terminal.css'

type Props = {
  lang?: 'zh' | 'en'
  resumeHref?: string
}

type RenderEntry = HistoryEntry & { id: string }

const DEMO_KEY = 'ygrowly-home-terminal-demo'

const toneClass: Record<Tone, string> = {
  fg: 'wt-tone-fg',
  muted: 'wt-tone-muted',
  primary: 'wt-tone-primary',
  ok: 'wt-tone-ok',
  err: 'wt-tone-err',
  warn: 'wt-tone-warn'
}

function renderLine(line: OutputLine, key: string) {
  if (line.kind === 'spacer') return <span key={key} className='wt-spacer' />
  if (line.kind === 'node') {
    return (
      <span key={key} className='wt-line'>
        {line.node}
      </span>
    )
  }
  return (
    <span key={key} className={`wt-line ${line.tone ? toneClass[line.tone] : ''}`}>
      {line.text || '\u00a0'}
    </span>
  )
}

function Prompt() {
  return <span className='wt-prompt'>$</span>
}

function staticEntries(lang: 'zh' | 'en'): RenderEntry[] {
  return [
    { id: 'static-whoami-input', kind: 'input', raw: 'whoami', cwd: '/' },
    {
      id: 'static-whoami-output',
      kind: 'output',
      lines: [
        {
          kind: 'text',
          tone: 'primary',
          text: lang === 'en' ? 'Yuguang Liu / Ygrowly' : '刘宇广 / Ygrowly'
        },
        { kind: 'text', text: 'AI Application Developer · Data Systems' },
        { kind: 'spacer' }
      ]
    },
    { id: 'static-systems-input', kind: 'input', raw: 'ls systems/', cwd: '/' },
    {
      id: 'static-systems-output',
      kind: 'output',
      lines: [
        { kind: 'text', text: 'energyops-agent' },
        { kind: 'text', text: 'ai-bi-platform' },
        { kind: 'text', text: 'paytrace  [building]' },
        { kind: 'spacer' }
      ]
    },
    { id: 'static-help-input', kind: 'input', raw: 'help', cwd: '/' },
    {
      id: 'static-help-output',
      kind: 'output',
      lines: [
        {
          kind: 'text',
          tone: 'muted',
          text: 'projects  experience  writing  resume  contact'
        }
      ]
    }
  ]
}

export default function TerminalShell({
  lang = 'zh',
  resumeHref = lang === 'en' ? '/resume-en.pdf' : '/resume.pdf'
}: Props) {
  const [fs, setFs] = useState<FsNode | null>(null)
  const [entries, setEntries] = useState<RenderEntry[]>(() => staticEntries(lang))
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [focused, setFocused] = useState(false)
  const [cwd, setCwd] = useState('/')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const idRef = useRef(0)
  const demoCancelledRef = useRef(false)

  const newId = () => `terminal-${++idRef.current}`

  const appendEntry = useCallback((entry: HistoryEntry) => {
    setEntries((current) => [...current, { ...entry, id: newId() }])
  }, [])

  const updateStream = useCallback((id: string, fn: (entry: HistoryEntry) => HistoryEntry) => {
    setEntries((current) =>
      current.map((entry) => (entry.id === id ? { ...fn(entry), id } : entry))
    )
  }, [])

  const loadFs = useCallback(() => {
    let cancelled = false
    fetchSiteFs()
      .then((tree) => {
        if (!cancelled) setFs(tree)
      })
      .catch(() => {
        /* A later command retries without exposing private filesystem state. */
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => loadFs(), [loadFs])

  const cancelDemo = useCallback(() => {
    if (demoCancelledRef.current) return
    demoCancelledRef.current = true
    try {
      sessionStorage.setItem(DEMO_KEY, 'done')
    } catch {
      /* Session storage can be unavailable in hardened browsers. */
    }
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let alreadySeen = false
    try {
      alreadySeen = sessionStorage.getItem(DEMO_KEY) === 'done'
    } catch {
      /* Continue with this visit's in-memory state. */
    }
    if (reducedMotion || alreadySeen) return

    const demoTimer = window.setTimeout(() => {
      if (demoCancelledRef.current) return
      appendEntry({ kind: 'input', raw: 'cat focus.md', cwd: '/' })
      appendEntry({
        kind: 'output',
        lines: [
          { kind: 'text', tone: 'primary', text: 'Agent Engineering' },
          { kind: 'text', text: 'Python Backend' },
          { kind: 'text', text: 'Data Systems' },
          { kind: 'text', tone: 'muted', text: 'Observable · Recoverable · Testable' }
        ]
      })
      cancelDemo()
    }, 800)

    const cancelOnScroll = () => {
      if (Math.abs(window.scrollY) > 40) cancelDemo()
    }
    const cancelOnVisibility = () => {
      if (document.hidden) cancelDemo()
    }
    const cancelOnLanguage = (event: Event) => {
      const target = event.target
      if (target instanceof Element && target.closest('.toggle-lang')) cancelDemo()
    }

    window.addEventListener('scroll', cancelOnScroll, { passive: true })
    window.addEventListener('ygrowly:theme-change', cancelDemo)
    document.addEventListener('visibilitychange', cancelOnVisibility)
    document.addEventListener('click', cancelOnLanguage)

    return () => {
      window.clearTimeout(demoTimer)
      window.removeEventListener('scroll', cancelOnScroll)
      window.removeEventListener('ygrowly:theme-change', cancelDemo)
      document.removeEventListener('visibilitychange', cancelOnVisibility)
      document.removeEventListener('click', cancelOnLanguage)
    }
  }, [appendEntry, cancelDemo])

  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [entries])

  const navigate = useCallback((path: string) => {
    window.location.assign(path)
  }, [])

  const setTheme = useCallback((mode: 'dark' | 'light' | 'system' | 'toggle') => {
    const currentDark = document.documentElement.classList.contains('dark')
    const target = mode === 'toggle' ? (currentDark ? 'light' : 'dark') : mode
    const resolved =
      target === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : target
    document.documentElement.classList.toggle('dark', resolved === 'dark')
    document.documentElement.dataset.theme = resolved
    try {
      localStorage.setItem('theme', target)
    } catch {
      /* Theme still applies for the current page. */
    }
    window.dispatchEvent(new CustomEvent('ygrowly:theme-change'))
  }, [])

  const runInput = useCallback(
    async (raw: string) => {
      cancelDemo()
      const trimmed = raw.trim().replace(/\s+/g, ' ')
      if (!trimmed) return
      appendEntry({ kind: 'input', raw: trimmed, cwd })
      setHistory((current) => [...current, trimmed])
      setHistoryIndex(-1)

      if (!fs) {
        appendEntry({
          kind: 'output',
          lines: [{ kind: 'text', tone: 'muted', text: 'Terminal is still booting. Try again.' }]
        })
        loadFs()
        return
      }

      const [rawName, ...args] = trimmed.split(' ')
      const name = rawName.toLowerCase()
      const command = commands[name]
      trackSiteEvent('terminal_command', {
        command: name,
        surface: 'terminal',
        target: 'home_terminal',
        ...classifyTerminalCommand(name, args, fs, cwd, Boolean(command))
      })

      if (!command) {
        appendEntry({
          kind: 'output',
          lines: [
            { kind: 'text', tone: 'err', text: `Command not found: ${name}` },
            { kind: 'text', tone: 'muted', text: 'Type "help" to see available commands.' }
          ]
        })
        return
      }

      const context = {
        args,
        raw: trimmed,
        fs,
        cwd,
        setCwd,
        registry: commands,
        push: (lines: OutputLine[]) => appendEntry({ kind: 'output', lines }),
        startStream: (id: string) => appendEntry({ kind: 'stream', id, lines: [], done: false }),
        appendStream: (id: string, line: OutputLine) =>
          updateStream(id, (entry) =>
            entry.kind === 'stream' ? { ...entry, lines: [...entry.lines, line] } : entry
          ),
        endStream: (id: string) =>
          updateStream(id, (entry) => (entry.kind === 'stream' ? { ...entry, done: true } : entry)),
        clear: () => setEntries([]),
        setTheme,
        setMatrix: () => {
          /* The legacy command remains registered; visual overlays stay out of the homepage. */
        },
        navigate,
        resumeHref
      }

      try {
        await command.run(context)
      } catch (error) {
        appendEntry({
          kind: 'output',
          lines: [
            {
              kind: 'text',
              tone: 'err',
              text: `error: ${error instanceof Error ? error.message : 'command failed'}`
            }
          ]
        })
      }
    },
    [appendEntry, cancelDemo, cwd, fs, loadFs, navigate, resumeHref, setTheme, updateStream]
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    cancelDemo()
    if (event.key === 'Enter') {
      event.preventDefault()
      const value = input
      setInput('')
      void runInput(value)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!history.length) return
      const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setInput(history[next])
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (historyIndex < 0) return
      const next = historyIndex + 1
      if (next >= history.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(next)
        setInput(history[next])
      }
      return
    }
    if (event.key === 'Tab') {
      event.preventDefault()
      if (!fs) return
      const completion = completeInput(input, { fs, cwd })
      if (typeof completion === 'string') setInput(completion)
      else if (completion) {
        appendEntry({ kind: 'output', lines: [{ kind: 'text', text: completion.join('  ') }] })
      }
      return
    }
    if (event.key.toLowerCase() === 'l' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      setEntries([])
    }
  }

  const focusInput = () => {
    cancelDemo()
    inputRef.current?.focus()
  }

  return (
    <div
      className='wt-shell'
      role='region'
      aria-label='Interactive portfolio terminal'
      onPointerDown={cancelDemo}
    >
      <div className='wt-titlebar'>
        <span className='wt-title'>ygrowly — terminal</span>
        <button
          className='wt-help'
          type='button'
          aria-label='Show terminal help'
          onClick={(event) => {
            event.stopPropagation()
            void runInput('help')
          }}
        >
          ?
        </button>
      </div>

      <div className='wt-body' ref={bodyRef} onClick={focusInput}>
        <div className='wt-entries' aria-live='polite' aria-atomic='false'>
          {entries.map((entry, index) => {
            if (entry.kind === 'input') {
              return (
                <div key={entry.id} className='wt-entry wt-entry--input'>
                  <Prompt />
                  <span className='wt-tone-fg'>{entry.raw}</span>
                </div>
              )
            }
            if (entry.kind === 'output') {
              return (
                <div key={entry.id} className='wt-entry'>
                  {entry.lines.map((line, lineIndex) =>
                    renderLine(line, `${entry.id}-${lineIndex}`)
                  )}
                </div>
              )
            }
            return (
              <div key={entry.id} className='wt-entry'>
                {entry.lines.map((line, lineIndex) => renderLine(line, `${entry.id}-${lineIndex}`))}
                {!entry.done && index === entries.length - 1 && (
                  <span className='wt-thinking'>···</span>
                )}
              </div>
            )
          })}
        </div>

        <div className='wt-input-row'>
          <Prompt />
          <span className='wt-input-display'>
            <span className='wt-tone-fg'>{input}</span>
            <span className={`wt-caret ${focused ? '' : 'wt-caret--idle'}`} aria-hidden />
            {!input && !focused && (
              <span className='wt-input-hint'>type help, projects, or resume</span>
            )}
          </span>
          <input
            ref={inputRef}
            className='wt-input-hidden'
            value={input}
            onChange={(event) => {
              cancelDemo()
              setInput(event.target.value)
            }}
            onKeyDown={onKeyDown}
            onFocus={() => {
              cancelDemo()
              setFocused(true)
            }}
            onBlur={() => setFocused(false)}
            spellCheck={false}
            autoCapitalize='off'
            autoCorrect='off'
            aria-label='Terminal command input'
          />
        </div>
      </div>

      <div className='wt-quick-actions' aria-label='Terminal shortcuts'>
        {[
          ['Projects', 'projects'],
          ['Resume', 'resume'],
          ['Contact', 'contact']
        ].map(([label, command]) => (
          <button key={command} type='button' onClick={() => void runInput(command)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
