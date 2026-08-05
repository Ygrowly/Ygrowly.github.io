import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'

import {
  discoverMarkdownFiles,
  executeImport,
  parseYuqueDocument,
  readImportMarker,
  sha256,
  withoutGeneratedMarker
} from './yuque-import'

const fence = String.fromCharCode(96).repeat(3)

function fixtureSource(extra = '') {
  return [
    '# Pi Agent Runtime',
    '',
    'description: 一篇介绍 Pi Agent Runtime 的源码阅读文章',
    'tags: Agent, Pi Agent, 源码阅读',
    '',
    '## 第 9 章：Compaction',
    '## 9.1 为什么需要压缩',
    '',
    fence + 'mermaid',
    'flowchart LR',
    '  A --> B',
    fence,
    '',
    '源码仓库：' +
      String.fromCharCode(96) +
      '[pi](https://github.com/example/pi)' +
      String.fromCharCode(96),
    '![架构图](https://cdn.nlark.com/yuque/example/architecture.png)',
    extra
  ].join('\n')
}

function makeWorkspace(source = fixtureSource()) {
  const root = mkdtempSync(join(tmpdir(), 'ygrowly-yuque-import-'))
  mkdirSync(join(root, 'md'), { recursive: true })
  writeFileSync(join(root, 'md', '2026-08-05-pi.md'), source, 'utf8')
  return root
}

describe('Yuque Markdown import', () => {
  test('parses metadata, removes it from the body, and reports heading risks', () => {
    const parsed = parseYuqueDocument(fixtureSource(), 'md/2026-08-05-pi.md', {
      cliDate: '2026-08-06'
    })

    expect(parsed.title).toBe('Pi Agent Runtime')
    expect(parsed.description).toContain('Pi Agent Runtime')
    expect(parsed.tags).toEqual(['Agent', 'Pi Agent', '源码阅读'])
    expect(parsed.date).toBe('2026-08-06')
    expect(parsed.body).not.toContain('description:')
    expect(parsed.body).not.toContain('# Pi Agent Runtime')
    expect(parsed.body).toContain('[pi](https://github.com/example/pi)')
    expect(parsed.body).toContain(fence + 'mermaid')
    expect(parsed.mermaidCount).toBe(1)
    expect(parsed.images).toHaveLength(1)
    expect(parsed.normalizedLinkCount).toBe(1)
    expect(
      parsed.messages.some((message) => message.message.includes('小节标题可能与章节同级'))
    ).toBe(true)
  })

  test('warns for Chinese chapter headings and preserves leading code indentation', () => {
    const source = [
      '# Indented article',
      '',
      'description: Description',
      'tags: test',
      '',
      '## 第九章：Runtime',
      '## 9.1 Details',
      '',
      '    const value = 1'
    ].join('\n')

    const parsed = parseYuqueDocument(source, 'md/2026-08-05-indented.md')

    expect(parsed.body).toContain('    const value = 1')
    expect(
      parsed.messages.some((message) => message.message.includes('小节标题可能与章节同级'))
    ).toBe(true)
  })

  test('prefers source publishDate over the command-line fallback', () => {
    const source = fixtureSource().replace(
      'tags: Agent, Pi Agent, 源码阅读',
      'tags: Agent, Pi Agent, 源码阅读\npublishDate: 2026-08-01'
    )
    const parsed = parseYuqueDocument(source, 'md/2026-08-05-pi.md', {
      cliDate: '2026-08-06'
    })

    expect(parsed.date).toBe('2026-08-01')
  })

  test('discovers nested Markdown files and reports batch items independently', async () => {
    const root = makeWorkspace()
    mkdirSync(join(root, 'md', 'nested'), { recursive: true })
    writeFileSync(join(root, 'md', 'nested', 'broken.md'), '# Broken\n', 'utf8')

    try {
      const files = discoverMarkdownFiles(join(root, 'md'))
      const reports = await Promise.all(
        files.map((file) =>
          executeImport({
            sourcePath: file.replace(root + '\\', ''),
            workspaceRoot: root
          })
        )
      )

      expect(files).toHaveLength(2)
      expect(reports.some((report) => report.status === 'dry-run')).toBe(true)
      expect(reports.some((report) => report.status === 'error')).toBe(true)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('dry-run never creates the target article or downloads images', async () => {
    const root = makeWorkspace()
    let fetchCount = 0

    try {
      const report = await executeImport({
        fetcher: async () => {
          fetchCount += 1
          return new Response('image', { headers: { 'content-type': 'image/png' } })
        },
        sourcePath: 'md/2026-08-05-pi.md',
        workspaceRoot: root
      })

      expect(report.status).toBe('dry-run')
      expect(report.outputPath).toBe('src/content/blog/20260805 - pi-agent-runtime')
      expect(report.stats.imageCount).toBe(1)
      expect(fetchCount).toBe(0)
      expect(existsSync(join(root, report.outputPath!))).toBe(false)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('write localizes Yuque images and keeps Mermaid fences intact', async () => {
    const root = makeWorkspace()

    try {
      const report = await executeImport({
        fetcher: async () => new Response('image', { headers: { 'content-type': 'image/png' } }),
        sourcePath: 'md/2026-08-05-pi.md',
        workspaceRoot: root,
        write: true
      })
      const articlePath = join(
        root,
        'src',
        'content',
        'blog',
        '20260805 - pi-agent-runtime',
        'post.mdx'
      )
      const article = readFileSync(articlePath, 'utf8')

      expect(report.status).toBe('written')
      expect(article).toContain('draft: true')
      expect(article).toContain('./assets/01-architecture.png')
      expect(article).toContain(fence + 'mermaid')
      expect(readImportMarker(article).sourceHash).toBe(
        sha256(readFileSync(join(root, 'md', '2026-08-05-pi.md')))
      )
      expect(sha256(withoutGeneratedMarker(article))).toBe(readImportMarker(article).generatedHash)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('skips unchanged sources and protects manually edited targets', async () => {
    const root = makeWorkspace()

    try {
      const options = {
        fetcher: async () => new Response('image', { headers: { 'content-type': 'image/png' } }),
        sourcePath: 'md/2026-08-05-pi.md',
        workspaceRoot: root,
        write: true
      }
      const first = await executeImport(options)
      const second = await executeImport(options)
      expect(first.status).toBe('written')
      expect(second.status).toBe('skipped')

      const articlePath = join(root, first.outputPath!, 'post.mdx')
      writeFileSync(articlePath, readFileSync(articlePath, 'utf8') + '\n人工修改\n', 'utf8')
      writeFileSync(join(root, 'md', '2026-08-05-pi.md'), fixtureSource('\n新增内容\n'), 'utf8')

      const blocked = await executeImport(options)
      expect(blocked.status).toBe('error')
      expect(blocked.messages.some((message) => message.message.includes('人工修改'))).toBe(true)

      const forced = await executeImport({ ...options, force: true })
      expect(forced.status).toBe('written')
      expect(forced.backupPath).toBeDefined()
      expect(existsSync(forced.backupPath!)).toBe(true)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
