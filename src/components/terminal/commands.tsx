import { SOCIAL_LINKS } from './fs/content'
import { displayPath, getNode, parentOf, prettyPath, resolvePath } from './fs/path'
import type { DirNode, FsNode } from './fs/types'
import type { CommandRegistry, CompletionContext, OutputLine } from './types'

type PagefindResult = {
  url: string
  excerpt: string
  meta: {
    title?: string
  }
}

type PagefindModule = {
  search: (query: string) => Promise<{
    results: Array<{
      data: () => Promise<PagefindResult>
    }>
  }>
}

const MOCK_AGENT_REPLIES: Record<string, string[]> = {
  default: [
    'Hey, this is Ygrowly (well, a tiny mock of him).',
    'Real agent endpoint is wiring up — for now I just rehearse lines.',
    'Try `chat what are you building?` or `chat hire you?` for canned answers.'
  ],
  building: [
    'Right now: EnergyOps Agent (energy data pipeline + alerting loop),',
    "PayTrace (payment anomaly diagnosis agent), and this site's redesign."
  ],
  hire: [
    'Open to chats — AI application / Python backend / agent engineering roles.',
    'Best path: `mail` (lyg3044@qq.com) or `connect` for socials.'
  ],
  stack: [
    'Astro 5 · React 19 · UnoCSS · TypeScript · deployed on Vercel.',
    'I lean into server-rendered HTML with small interactive islands.'
  ]
}

function pickReply(msg: string): string[] {
  const m = msg.toLowerCase()
  if (m.includes('build')) return MOCK_AGENT_REPLIES.building
  if (m.includes('hire') || m.includes('job') || m.includes('work')) return MOCK_AGENT_REPLIES.hire
  if (m.includes('stack') || m.includes('tech')) return MOCK_AGENT_REPLIES.stack
  return MOCK_AGENT_REPLIES.default
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

function isEnglishPage() {
  return typeof window !== 'undefined' && window.location.pathname.startsWith('/en')
}

function localizedPath(path: string) {
  return `${isEnglishPage() ? '/en' : ''}${path}`
}

function nodeBadge(node: FsNode): string {
  if (node.type === 'dir') return '/'
  if (node.type === 'link') return '@'
  return ' '
}

function formatLs(dir: DirNode): OutputLine[] {
  if (dir.children.length === 0) {
    return [{ kind: 'text', tone: 'muted', text: '(empty)' }]
  }
  const width = Math.max(...dir.children.map((c) => c.name.length)) + 2
  return dir.children.map<OutputLine>((c) => ({
    kind: 'node',
    node: (
      <span>
        <span className='wt-tone-primary'>{(c.name + nodeBadge(c)).padEnd(width + 1)}</span>
        <span className='wt-tone-muted'>{c.description ?? ''}</span>
      </span>
    )
  }))
}

export const commands: CommandRegistry = {
  help: {
    name: 'help',
    summary: 'list available commands',
    run: ({ push, registry }) => {
      const visible = Object.values(registry).filter((c) => !c.hidden)
      const width = Math.max(...visible.map((c) => c.name.length)) + 2
      push([
        { kind: 'text', tone: 'muted', text: 'Available commands — try them out.' },
        { kind: 'spacer' },
        ...visible.map<OutputLine>((c) => ({
          kind: 'node',
          node: (
            <span>
              <span className='wt-tone-primary'>{c.name.padEnd(width)}</span>
              <span className='wt-tone-muted'>{c.summary}</span>
            </span>
          )
        })),
        { kind: 'spacer' },
        {
          kind: 'text',
          tone: 'muted',
          text: 'shortcuts: ↑/↓ history · tab complete · ⌃L clear · ` focus'
        }
      ])
    }
  },

  whoami: {
    name: 'whoami',
    summary: 'about Ygrowly',
    run: ({ push }) => {
      push([
        {
          kind: 'node',
          node: (
            <span>
              <span className='wt-tone-primary'>Ygrowly</span>
              <span className='wt-tone-muted'> · AI application developer based in China</span>
            </span>
          )
        },
        { kind: 'text', tone: 'muted', text: '  ↳ Data Science undergrad · class of 2027' },
        {
          kind: 'text',
          tone: 'muted',
          text: '  ↳ Agent engineering · Python backend · data systems'
        },
        {
          kind: 'text',
          tone: 'muted',
          text: '  ↳ building AI into real systems, not just demos'
        },
        { kind: 'spacer' },
        { kind: 'text', tone: 'muted', text: 'next: try `ls`, `cat about`, or `cd /blog`' }
      ])
    }
  },

  projects: {
    name: 'projects',
    summary: 'selected systems and current lab work',
    run: ({ push }) => {
      const projects = [
        ['EnergyOps Agent', localizedPath('/projects/energyops-agent')],
        [
          isEnglishPage() ? 'DataSphere AI BI / 数驭穹图' : '数驭穹图 AI BI',
          localizedPath('/projects/ai-bi-platform')
        ],
        ['RuleArena', localizedPath('/projects/rulearena')],
        ['PayTrace [lab]', localizedPath('/projects/paytrace')]
      ]
      push(
        projects.map<OutputLine>(([label, href]) => ({
          kind: 'node',
          node: (
            <span>
              <span className='wt-tone-primary'>{label.padEnd(28)}</span>
              <a className='wt-link' href={href}>
                {href}
              </a>
            </span>
          )
        }))
      )
    }
  },

  experience: {
    name: 'experience',
    summary: 'three recent engineering roles',
    run: ({ push }) => {
      push([
        { kind: 'text', tone: 'primary', text: '2026.05 — NOW  Kingsoft Office' },
        { kind: 'text', tone: 'muted', text: 'Energy data · alerts · MCP / WPS Comate' },
        { kind: 'text', tone: 'primary', text: '2025.10 — 2026.03  Shenzhen Huize Zhiyuan' },
        { kind: 'text', tone: 'muted', text: 'Collaborative data · lakehouse · Text-to-SQL' },
        { kind: 'text', tone: 'primary', text: '2025.09 — 2026.01  Chengdu Qidian Tuojie' },
        {
          kind: 'text',
          tone: 'muted',
          text: 'Ingestion · AI classification · notification pipeline'
        }
      ])
    }
  },

  writing: {
    name: 'writing',
    summary: 'open the latest blog and notes indexes',
    run: ({ push }) => {
      const blog = localizedPath('/blog')
      const notes = localizedPath('/notes')
      push([
        {
          kind: 'node',
          node: (
            <span>
              <span className='wt-tone-primary'>Blog </span>
              <a className='wt-link' href={blog}>
                {blog}
              </a>
            </span>
          )
        },
        {
          kind: 'node',
          node: (
            <span>
              <span className='wt-tone-primary'>Notes </span>
              <a className='wt-link' href={notes}>
                {notes}
              </a>
            </span>
          )
        }
      ])
    }
  },

  skills: {
    name: 'skills',
    summary: 'backend and AI engineering focus',
    run: ({ push }) => {
      push([
        {
          kind: 'text',
          text: 'Backend        Python · FastAPI · PostgreSQL · Redis · Docker'
        },
        {
          kind: 'text',
          text: 'AI Engineering MCP · Tool Use · Eval · Memory · Observability'
        }
      ])
    }
  },

  github: {
    name: 'github',
    summary: 'show the public GitHub profile',
    run: ({ push }) => {
      const href = 'https://github.com/Ygrowly'
      push([
        {
          kind: 'node',
          node: (
            <a className='wt-link' href={href} target='_blank' rel='noopener noreferrer'>
              {href}
            </a>
          )
        }
      ])
    }
  },

  contact: {
    name: 'contact',
    summary: 'email and opportunity status',
    run: ({ push }) => {
      push([
        { kind: 'text', tone: 'primary', text: 'Open to opportunities · Class of 2027' },
        {
          kind: 'node',
          node: (
            <a className='wt-link' href='mailto:lyg3044@qq.com'>
              lyg3044@qq.com
            </a>
          )
        }
      ])
    }
  },

  lang: {
    name: 'lang',
    summary: 'show or switch language',
    usage: 'lang [zh|en]',
    complete: (args) => (args.length <= 1 ? ['zh', 'en'] : []),
    run: ({ args, push, navigate }) => {
      const target = args[0]?.toLowerCase()
      if (!target) {
        push([
          {
            kind: 'text',
            text: `language → ${isEnglishPage() ? 'en' : 'zh'} · available: zh, en`
          }
        ])
        return
      }
      if (!['zh', 'en'].includes(target)) {
        push([{ kind: 'text', tone: 'err', text: `lang: invalid language '${target}'` }])
        return
      }
      navigate(target === 'en' ? '/en' : '/')
    }
  },

  devmode: {
    name: 'devmode',
    summary: 'enter the existing developer shell',
    run: ({ push, setMode }) => {
      if (setMode) {
        push([{ kind: 'text', tone: 'muted', text: 'Already in dev mode.' }])
        return
      }
      push([{ kind: 'text', tone: 'muted', text: 'Entering dev mode…' }])
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ygrowly:toggle-dev'))
      }
    }
  },

  pwd: {
    name: 'pwd',
    summary: 'print current path',
    run: ({ cwd, push }) => push([{ kind: 'text', text: prettyPath(cwd) }])
  },

  cd: {
    name: 'cd',
    summary: 'change directory',
    usage: 'cd [path]',
    complete: (args, ctx) => completePath(args, ctx, 'dir'),
    run: ({ args, fs, cwd, setCwd, push }) => {
      const target = args[0] ? resolvePath(cwd, args[0]) : '/'
      const node = getNode(fs, target)
      if (!node) {
        push([{ kind: 'text', tone: 'err', text: `cd: ${args[0]}: no such file or directory` }])
        return
      }
      if (node.type !== 'dir') {
        push([{ kind: 'text', tone: 'err', text: `cd: ${args[0]}: not a directory` }])
        return
      }
      setCwd(target)
    }
  },

  ls: {
    name: 'ls',
    summary: 'list directory contents',
    usage: 'ls [path]',
    complete: (args, ctx) => completePath(args, ctx, 'any'),
    run: ({ args, fs, cwd, push }) => {
      const target = args[0] ? resolvePath(cwd, args[0]) : cwd
      const node = getNode(fs, target)
      if (!node) {
        push([{ kind: 'text', tone: 'err', text: `ls: ${args[0]}: no such file or directory` }])
        return
      }
      if (node.type !== 'dir') {
        // ls on a file/link → show stat-like one-liner
        const badge = node.type === 'link' ? '@' : ''
        push([
          {
            kind: 'node',
            node: (
              <span>
                <span className='wt-tone-primary'>{node.name + badge}</span>
                <span className='wt-tone-muted'> {node.description ?? ''}</span>
              </span>
            )
          }
        ])
        return
      }
      push(formatLs(node))
    }
  },

  cat: {
    name: 'cat',
    summary: 'print file contents',
    usage: 'cat <path>',
    complete: (args, ctx) => completePath(args, ctx, 'file'),
    run: ({ args, fs, cwd, push, openViewer }) => {
      if (!args[0]) {
        push([{ kind: 'text', tone: 'err', text: 'cat: missing operand — try `ls` first' }])
        return
      }
      const target = resolvePath(cwd, args[0])
      const node = getNode(fs, target)
      if (!node) {
        push([{ kind: 'text', tone: 'err', text: `cat: ${args[0]}: no such file or directory` }])
        return
      }
      if (node.type === 'dir') {
        push([{ kind: 'text', tone: 'err', text: `cat: ${args[0]}: is a directory` }])
        return
      }
      if (node.type === 'link') {
        push([
          {
            kind: 'node',
            node: (
              <span>
                <span className='wt-tone-muted'>{node.name} → </span>
                <a className='wt-link' href={node.href} target='_blank' rel='noreferrer'>
                  {node.display ?? node.href}
                </a>
              </span>
            )
          },
          { kind: 'text', tone: 'muted', text: 'use `open` to follow.' }
        ])
        return
      }
      // file
      if (node.content) {
        const lines = node.content.split('\n')
        push(lines.map<OutputLine>((text) => ({ kind: 'text', text })))
        return
      }
      // endpoint-backed file → inline viewer if the host supports it
      if (node.endpoint && openViewer) {
        push([{ kind: 'text', tone: 'muted', text: `opening ${target} in viewer …` }])
        openViewer(node, target)
        return
      }
      // No viewer host: home-page TerminalShell. Point users at dev mode
      // (which has the inline reader) and the rendered blog page as a
      // fallback. `node.href` is set by the manifest for blog/notes posts.
      const lines: OutputLine[] = []
      if (node.endpoint) {
        lines.push({
          kind: 'text',
          tone: 'muted',
          text: 'inline preview only in dev mode — press ` to enter, then `cat` again.'
        })
      } else {
        lines.push({
          kind: 'text',
          tone: 'muted',
          text: '(inline preview not available for this entry)'
        })
      }
      if (node.href) {
        lines.push({
          kind: 'node',
          node: (
            <span>
              <span className='wt-tone-muted'>view rendered: </span>
              <a className='wt-link' href={node.href}>
                {node.href}
              </a>
            </span>
          )
        })
      }
      push(lines)
    }
  },

  open: {
    name: 'open',
    summary: 'navigate to a path or link',
    usage: 'open <path>',
    complete: (args, ctx) => completePath(args, ctx, 'any'),
    run: ({ args, fs, cwd, push, navigate }) => {
      if (!args[0]) {
        push([{ kind: 'text', tone: 'err', text: 'open: missing operand' }])
        return
      }
      const projectRoutes: Record<string, string> = {
        'energyops-agent': localizedPath('/projects/energyops-agent'),
        'ai-bi-platform': localizedPath('/projects/ai-bi-platform'),
        rulearena: localizedPath('/projects/rulearena'),
        paytrace: localizedPath('/projects/paytrace')
      }
      if (projectRoutes[args[0]]) {
        navigate(projectRoutes[args[0]])
        return
      }
      const target = resolvePath(cwd, args[0])
      const node = getNode(fs, target)
      if (!node) {
        if (/^\/(blog|notes|search|projects|links|about|contact)(\/|$)/.test(args[0])) {
          push([{ kind: 'text', tone: 'muted', text: `navigating ${args[0]} …` }])
          setTimeout(() => navigate(args[0]), 200)
          return
        }
        push([{ kind: 'text', tone: 'err', text: `open: ${args[0]}: no such file or directory` }])
        return
      }
      if (node.type === 'link') {
        if (typeof window !== 'undefined') window.open(node.href, '_blank', 'noopener')
        push([{ kind: 'text', tone: 'muted', text: `opening ${node.href} …` }])
        return
      }
      if (node.type === 'file' && node.href) {
        push([{ kind: 'text', tone: 'muted', text: `navigating ${node.href} …` }])
        setTimeout(() => navigate(node.href!), 200)
        return
      }
      push([{ kind: 'text', tone: 'err', text: `open: ${args[0]}: nothing to open` }])
    }
  },

  search: {
    name: 'search',
    summary: 'search posts and notes',
    usage: 'search <query>',
    run: async ({ args, push }) => {
      const query = args.join(' ').trim()
      if (query.length < 2) {
        push([{ kind: 'text', tone: 'err', text: 'search: query must be at least 2 characters' }])
        return
      }

      push([{ kind: 'text', tone: 'muted', text: `searching "${query}" …` }])

      try {
        const bundlePath = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/pagefind/pagefind.js`
        const pagefind = (await import(/* @vite-ignore */ bundlePath)) as PagefindModule
        const search = await pagefind.search(query)
        const results = await Promise.all(search.results.slice(0, 6).map((result) => result.data()))

        if (results.length === 0) {
          push([{ kind: 'text', tone: 'muted', text: 'no results' }])
          return
        }

        const lines: OutputLine[] = [
          { kind: 'text', tone: 'muted', text: `${results.length} results` },
          { kind: 'spacer' }
        ]

        results.forEach((result, index) => {
          const collection = result.url.includes('/notes/') ? 'note' : 'blog'
          lines.push(
            {
              kind: 'node',
              node: (
                <span>
                  <span className='wt-tone-primary'>{String(index + 1).padStart(2, '0')}. </span>
                  <span className='wt-tone-muted'>[{collection}] </span>
                  <a className='wt-link' href={result.url}>
                    {result.meta.title ?? result.url}
                  </a>
                </span>
              )
            },
            {
              kind: 'text',
              tone: 'muted',
              text: `    ${result.excerpt || result.url}`
            },
            {
              kind: 'text',
              tone: 'muted',
              text: `    open ${result.url}`
            }
          )
        })

        push(lines)
      } catch (err) {
        push([
          {
            kind: 'text',
            tone: 'err',
            text: `search: ${err instanceof Error ? err.message : 'request failed'}`
          }
        ])
      }
    }
  },

  manifest: {
    name: 'manifest',
    summary: 'fetch the agent-facing site map (public knowledge index)',
    usage: 'manifest [--url]',
    run: async ({ args, push }) => {
      const url = '/api/knowledge/index.json'
      // `manifest --url` just prints the public URL (handy for sharing)
      if (args[0] === '--url' || args[0] === '-u') {
        push([
          {
            kind: 'node',
            node: (
              <span>
                <span className='wt-tone-muted'>public manifest: </span>
                <a className='wt-link' href={url} target='_blank' rel='noreferrer'>
                  {url}
                </a>
              </span>
            )
          }
        ])
        return
      }
      push([{ kind: 'text', tone: 'muted', text: `fetching ${url} …` }])
      try {
        const r = await fetch(url, { headers: { accept: 'application/json' } })
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const text = await r.text()
        // Single node — rendering 200+ separate lines through setState
        // each was choking React, so dump the whole pretty JSON in one
        // <pre> with a small banner above it.
        push([
          {
            kind: 'node',
            node: (
              <span>
                <span className='wt-tone-muted'>fetched · </span>
                <a className='wt-link' href={url} target='_blank' rel='noreferrer'>
                  view raw
                </a>
              </span>
            )
          },
          { kind: 'spacer' },
          {
            kind: 'node',
            node: <pre className='wt-json'>{text}</pre>
          }
        ])
      } catch (err) {
        push([
          {
            kind: 'text',
            tone: 'err',
            text: `manifest: ${err instanceof Error ? err.message : 'fetch failed'}`
          }
        ])
      }
    }
  },

  design: {
    name: 'design',
    summary: 'download DESIGN.md',
    run: ({ push }) => {
      const href = '/api/design.md'
      push([
        { kind: 'text', tone: 'muted', text: 'downloading design.md…' },
        {
          kind: 'node',
          node: (
            <a className='wt-link' href={href} download='design.md'>
              {href}
            </a>
          )
        }
      ])
      if (typeof document !== 'undefined') {
        const a = document.createElement('a')
        a.href = href
        a.download = 'design.md'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    }
  },

  chat: {
    name: 'chat',
    summary: 'talk to my agent (mock)',
    usage: 'chat [message]',
    run: async ({ args, startStream, appendStream, endStream }) => {
      const message = args.join(' ').trim()
      const id = `chat-${Date.now()}`
      startStream(id)
      appendStream(id, { kind: 'text', tone: 'muted', text: '⠋ thinking…' })
      await sleep(420)
      const lines = message ? pickReply(message) : MOCK_AGENT_REPLIES.default
      appendStream(id, { kind: 'spacer' })
      for (const line of lines) {
        appendStream(id, {
          kind: 'node',
          node: (
            <span>
              <span className='wt-tone-primary'>agent ▸ </span>
              <span className='wt-tone-fg'>{line}</span>
            </span>
          )
        })
        await sleep(260)
      }
      endStream(id)
    }
  },

  mail: {
    name: 'mail',
    summary: 'send me an email',
    run: ({ push }) => {
      const href = 'mailto:lyg3044@qq.com?subject=hi%20ygrowly'
      push([
        { kind: 'text', tone: 'muted', text: 'opening your mail client…' },
        {
          kind: 'node',
          node: (
            <a className='wt-link' href={href}>
              lyg3044@qq.com
            </a>
          )
        }
      ])
      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.href = href
      }, 200)
    }
  },

  connect: {
    name: 'connect',
    summary: 'social links',
    run: ({ push }) => {
      push(
        SOCIAL_LINKS.map<OutputLine>((s) => ({
          kind: 'node',
          node: (
            <span>
              <span className='wt-tone-primary'>{s.label.padEnd(10)}</span>
              <a className='wt-link' href={s.href} target='_blank' rel='noreferrer'>
                {s.href}
              </a>
            </span>
          )
        }))
      )
    }
  },

  theme: {
    name: 'theme',
    summary: 'switch site theme',
    usage: 'theme [dark|light|system]',
    complete: (args) => (args.length <= 1 ? ['dark', 'light', 'system'] : []),
    run: ({ args, push, setTheme }) => {
      const requested = args[0]?.toLowerCase()
      if (!requested) {
        const stored =
          typeof window === 'undefined' ? 'system' : (localStorage.getItem('theme') ?? 'system')
        push([{ kind: 'text', text: `theme → ${stored} · available: light, dark, system` }])
        return
      }
      if (!['dark', 'light', 'system'].includes(requested)) {
        push([{ kind: 'text', tone: 'err', text: `theme: invalid mode '${requested}'` }])
        return
      }
      const mode = requested as 'dark' | 'light' | 'system'
      setTheme(mode)
      push([{ kind: 'text', tone: 'ok', text: `theme → ${mode}` }])
    }
  },

  echo: {
    name: 'echo',
    summary: 'print arguments',
    run: ({ args, push }) => push([{ kind: 'text', text: args.join(' ') }])
  },

  clear: {
    name: 'clear',
    summary: 'clear the screen',
    run: ({ clear }) => clear()
  },

  exit: {
    name: 'exit',
    summary: 'leave dev mode',
    run: ({ push, setMode }) => {
      if (setMode) {
        push([{ kind: 'text', tone: 'muted', text: 'bye ✦ back to human mode…' }])
        setTimeout(() => setMode('human'), 180)
        return
      }
      push([{ kind: 'text', tone: 'muted', text: 'already in human mode — try `` ` `` to toggle' }])
    }
  },

  matrix: {
    name: 'matrix',
    summary: 'easter egg',
    run: async ({ push, setMatrix }) => {
      push([{ kind: 'text', tone: 'ok', text: 'wake up, neo… (3s)' }])
      setMatrix(true)
      await sleep(3000)
      setMatrix(false)
      push([{ kind: 'text', tone: 'muted', text: 'follow the white rabbit.' }])
    }
  },

  about: {
    name: 'about',
    summary: 'personal engineering stance and About page',
    run: ({ push }) => {
      const href = localizedPath('/about')
      push([
        {
          kind: 'text',
          text: 'Observable · Recoverable · Testable AI inside real business workflows.'
        },
        {
          kind: 'node',
          node: (
            <a className='wt-link' href={href}>
              {href}
            </a>
          )
        }
      ])
    }
  },

  sudo: {
    name: 'sudo',
    summary: 'nice try',
    hidden: true,
    run: ({ args, push }) => {
      if (args.join(' ') === 'hire-me') {
        push([
          { kind: 'text', tone: 'ok', text: '✓ permission granted.' },
          { kind: 'text', tone: 'muted', text: '`mail` to start the conversation.' }
        ])
        return
      }
      push([
        { kind: 'text', tone: 'err', text: 'Permission denied (you are not in the sudoers file).' }
      ])
    }
  }
}

export const commandNames = Object.keys(commands)

/**
 * Path completion helper. Splits the partial token into a base directory
 * and a leaf prefix, walks the FS to that base, and returns full token
 * candidates filtered by the leaf prefix.
 *
 *   filter='dir'  → only directories (used by `cd`)
 *   filter='file' → files + links     (used by `cat`)
 *   filter='any'  → everything       (used by `ls`/`open`)
 */
function completePath(
  args: string[],
  ctx: CompletionContext,
  filter: 'dir' | 'file' | 'any'
): string[] {
  if (args.length > 1) return []
  const partial = args[0] ?? ''
  // split prefix vs leaf: everything up to the last '/' is the prefix
  const slashIdx = partial.lastIndexOf('/')
  const prefix = slashIdx >= 0 ? partial.slice(0, slashIdx + 1) : ''
  const leaf = slashIdx >= 0 ? partial.slice(slashIdx + 1) : partial
  const baseInput = slashIdx >= 0 ? partial.slice(0, slashIdx + 1) || '/' : '.'
  const baseAbs = resolvePath(ctx.cwd, baseInput)
  const baseNode = getNode(ctx.fs, baseAbs)
  if (!baseNode || baseNode.type !== 'dir') return []
  return baseNode.children
    .filter((c) => c.name.startsWith(leaf))
    .filter((c) => {
      if (filter === 'any') return true
      if (filter === 'dir') return c.type === 'dir'
      return c.type !== 'dir'
    })
    .map((c) => prefix + c.name + (c.type === 'dir' ? '/' : ''))
}

function commonPrefix(items: string[]): string {
  if (items.length === 0) return ''
  let prefix = items[0]
  for (let i = 1; i < items.length; i++) {
    while (!items[i].startsWith(prefix)) prefix = prefix.slice(0, -1)
    if (!prefix) return ''
  }
  return prefix
}

/**
 * Resolve a Tab completion for the current input buffer.
 * Returns:
 *   - a string  → replace input with this value
 *   - an array  → ambiguous, show as suggestions
 *   - null      → nothing to do
 */
export function completeInput(input: string, ctx: CompletionContext): string | string[] | null {
  const hasSpace = /\s/.test(input)
  if (!hasSpace) {
    const head = input.trimStart()
    const candidates = commandNames.filter((n) => n.startsWith(head) && !commands[n].hidden)
    if (candidates.length === 0) return null
    if (candidates.length === 1) return candidates[0] + ' '
    const lcp = commonPrefix(candidates)
    if (lcp.length > head.length) return lcp
    return candidates
  }

  const tokens = input.split(/\s+/)
  const cmd = tokens[0].toLowerCase()
  const spec = commands[cmd]
  if (!spec || !spec.complete) return null
  const argTokens = tokens.slice(1)
  const partial = argTokens[argTokens.length - 1] ?? ''
  const all = spec.complete(argTokens, ctx)
  const matches = all.filter((c) => c.startsWith(partial))
  if (matches.length === 0) return null
  const replaceLast = (next: string) => {
    const head = tokens.slice(0, -1).join(' ')
    return head + ' ' + next
  }
  if (matches.length === 1) {
    // For dirs we leave the trailing slash so the user can keep typing.
    const m = matches[0]
    return m.endsWith('/') ? replaceLast(m) : replaceLast(m) + ' '
  }
  const lcp = commonPrefix(matches)
  if (lcp.length > partial.length) return replaceLast(lcp)
  return matches
}

// silence unused-symbol warnings while we keep these helpers around
void parentOf
void displayPath
