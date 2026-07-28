import { describe, expect, test } from 'bun:test'

import { commands } from './commands'
import type { CommandContext, OutputLine } from './types'

const requiredCommands = [
  'help',
  'whoami',
  'about',
  'projects',
  'experience',
  'writing',
  'skills',
  'resume',
  'github',
  'contact',
  'theme',
  'lang',
  'clear',
  'devmode'
]

describe('portfolio terminal commands', () => {
  test('registers every required public command without removing the legacy registry', () => {
    for (const name of requiredCommands) {
      expect(commands[name]).toBeDefined()
      expect(commands[name].hidden).not.toBe(true)
    }
    expect(commands.ls).toBeDefined()
    expect(commands.cat).toBeDefined()
    expect(commands.search).toBeDefined()
  })

  test('theme supports light, dark, and system without toggling on a status query', async () => {
    const modes: string[] = []
    const lines: OutputLine[][] = []
    const context = commandContext({
      args: [],
      push: (output) => lines.push(output),
      setTheme: (mode) => modes.push(mode)
    })

    await commands.theme.run(context)
    expect(modes).toEqual([])
    expect(
      lines.flat().some((line) => line.kind === 'text' && line.text.includes('available'))
    ).toBe(true)

    for (const mode of ['light', 'dark', 'system'] as const) {
      await commands.theme.run({ ...context, args: [mode] })
    }
    expect(modes).toEqual(['light', 'dark', 'system'])
  })

  test('resume reports the provided stable path without opening it automatically', async () => {
    const lines: OutputLine[][] = []
    const context = commandContext({
      resumeHref: '/resume.pdf',
      push: (output) => lines.push(output)
    })

    await commands.resume.run(context)
    expect(lines).toHaveLength(1)
    expect(JSON.stringify(lines)).toContain('/resume.pdf')
  })
})

function commandContext(overrides: Partial<CommandContext>): CommandContext {
  return {
    args: [],
    raw: '',
    fs: { type: 'dir', name: '', children: [] },
    cwd: '/',
    setCwd: () => {},
    push: () => {},
    startStream: () => {},
    appendStream: () => {},
    endStream: () => {},
    clear: () => {},
    setTheme: () => {},
    setMatrix: () => {},
    navigate: () => {},
    registry: commands,
    ...overrides
  }
}
